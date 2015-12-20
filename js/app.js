/*GLOBAL VARIABLE */
var map;

/* INITIALIZE THE DEFAULT INFOWINDOW */
var infoWindow;

/* MODEL */
var myMarkers = [
  {
    lat: 25.088541,
    lng: 55.147070,
    title: 'Princess Tower',
    id: 234909984
  },
  {
    lat: 25.195034,
    lng: 55.278922,
    title: 'Fortnum & Mason',
    id: 342790630
  },
  {
    lat: 25.083468,
    lng: 55.141007,
    title: 'Tidjoori',
    id: 527283863
  },
  {
    lat: 25.1972807,
    lng: 55.2473543,
    title: 'Cioccolati Italiani',
    id: 1004348591
  },
  {
    lat: 25.160809,
    lng: 55.205575,
    title: 'Kite Beach',
    id: 2145472
  }
];

/*MARKER CLASS */
var Marker = function(data) {
  var self = this;
  self.position = data.position;
  self.title = ko.observable(data.title);
  self.lat = ko.observable(data.lat);
  self.lng = ko.observable(data.lng);
  self.id = ko.observable(data.id);
  self.pics = ko.observableArray([]);
  var apiworked = false;

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(self.lat(), self.lng()),
    /*REMOVED MAP DECLARATION BECAUSE THIS WILL BE SET BY THE RESULTS */
    //map: map,
    title: self.title()
  });

  self.marker = ko.observable(marker);
};

/*VIEW MODEL */
var ViewModel = function() {
  var self = this;
  self.MarkerList = ko.observableArray([]);
  self.query = ko.observable('');

  self.resultList = ko.computed(function(){

    /*THIS FUNCTION WILL ITERATE THROUGH THE INPUT BOX AND ADJUST THE ARRAY AND MARKERS DISPLAYED ACCORDINGLY */
    for (var i=0 ; i< self.MarkerList().length; i++ ) {

      /*IF THERE IS NO SEARCH QUERY THEN SHOW ALL MARKERS. THIS IS CALLED FIRST TIME SO SET MARKER TO MAP AS WELL*/
      if(self.query() === '') {
        self.MarkerList()[i].marker().setMap(map);
        self.MarkerList()[i].marker().setVisible(true);
      }

      /*THERE IS SEARCH QUERY SO FILTER RESULTS ACCORDINGLY*/
      else {
        /*IF QUERY NOT FOUND SET MARKER TO NULL AND CLOSE INFOWINDOW*/
        if(self.MarkerList()[i].title().toLowerCase().indexOf(self.query().toLowerCase())<0) {
          self.MarkerList()[i].marker().setVisible(false);
          infoWindow.close();
        }
        /*ELSE QUERY FOUND SO SHOW MARKER ON THE MAP*/
        else {
          self.MarkerList()[i].marker().setVisible(true);  
        }
      }
    }

    /*RETURN A FILTERED ARRAY BASED ON THE QUERY*/
    return ko.utils.arrayFilter(self.MarkerList(), function(thisMark) {
      return thisMark.title().toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
    });
  });

  self.getInstaPics = function(thisMark) {
    /*THIS FUNCTION WILL USE THE INSTAGRAM API TO RETRIEVE IMAGES BASED ON THE LOCATION ID IN THE MODEL AND MY RECENT PICTURES*/
    var token = '250560512.a11a3ce.8a8a95c030f74763bdc98cff75607c57';
    var locID = thisMark.id();
    var instaURL = 'https://api.instagram.com/v1/locations/'+ locID +'/media/recent?access_token=' + token + '&callback=callbackFunction';

    //console.log('Instagram URL: ' + instaURL);
    var instaRequestTimeout = setTimeout( function() {
        /* THIS IS FOR DEBUGGING PURPOSES */
        console.log("TIME OUT: failed to get insta resources for " + thisMark.title() );
    }, 10000);
    
    $.ajax({
      type: "GET",
      url: instaURL,
      cache: false,
      dataType: "jsonp"
    })
      .done(function(fetcheddata) {
        /*GET SIZE OF fetcheddata. IF MORE THAN 6 THEN ONLY ITERATE THROUGH FIRST 6. */
        var numberofimages = fetcheddata.data.length >= 6 ? 6 : fetcheddata.data.length;

        /*ITERATE THROUGH UPTO FIRST 6 IMAGES */
        for (var i = 0; i < numberofimages; i++) {
            var ipic = fetcheddata.data[i].images.thumbnail.url;
            var ilink = fetcheddata.data[i].link;
            /* STORE THE IMAGE AND LINK AGAINST THE MARKER */
            thisMark.pics().push({'pic': ipic, 'link':ilink});
        }

        /*FLAG THAT THE INSTAGRAM RETRIEVAL HAS WORKED SUCCESSFULLY */
        thisMark.apiworked = true;
        //console.log('Number of pics in '+ thisMark.title() + ' is: ' + thisMark.pics().length);
        clearTimeout(instaRequestTimeout );
      })
      .fail(function (e) {
          /* THIS IS FOR DEBUGGING PURPOSES */
          console.log('API failed for ' + thisMark.title());
          thisMark.apiworked = false;
      });

    return false;
  };

  /*FUNCTION TO ANIMATE THE MARKER ON THE MAP*/
  self.setMarkerAnimation = function(thisMark) {
    thisMark.marker().setAnimation(google.maps.Animation.BOUNCE);
    setTimeout( function() { 
      thisMark.marker().setAnimation(null); 
    }, 1400);
  };

  /*FUNCTION TO CLOSE THE MENU ON MOBILE FORMAT*/
  self.closeMenu = function () {
    $('#drawer').removeClass('open');
  };

  /*FUNCTION TO OPEN THE MENU ON MOBILE FORMAT*/
  self.openMenu = function () {
    $('#drawer').addClass('open');
  };

  /*FUNCTION WHEN CLICKED (EITHER IN LIST OR MARKER)*/
  self.markerClick = function(thisMark) {

    /*HYPERLINK TO VIEW MORE IMAGES FROM THIS LOCATION*/
    var linktoInsta = 'https://www.instagram.com/explore/locations/' + thisMark.id() + '/';

    var codetodisplaygrid = '';

    /*CHECK IF API PASSED*/
    if(!thisMark.apiworked) {
      codetodisplaygrid = 'Error! Failed to return Instagram images';
    }

    /*IF THERE ARE PICS TO BE DISPLAYED THEN CREATE CONTENT FOR PICS*/
    else if(thisMark.pics().length > 0) {
      codetodisplaygrid = 'Recent Pics: <br>';

      for(var i = 0; i < thisMark.pics().length; i++) {
        codetodisplaygrid = codetodisplaygrid + '<span id="insta-pic"><a href="' + thisMark.pics()[i].link + '" target="_blank">' +
                            '<img src="' + thisMark.pics()[i].pic + '" />' +
                            '</a></span>';
      }
    }

    /*SET THE CONTENT OF THE INFOWINDOW*/
    var infoContent = '<div><h4 id="info-name">' + thisMark.title() + '</h4>' + 
                      '<p id="info-insta">'+ codetodisplaygrid + 
                      '<br/><a href="'+ linktoInsta + '" target="_blank">Click here for more pics</a></p></div>';

    infoWindow.setContent(infoContent);

    /*OPEN THE INFOWINDOW AT THE MARKER LOCATION*/
    infoWindow.open(map, thisMark.marker());

    /*PAN THE MAP TO THE MARKER CLICKED*/
    map.panTo(new google.maps.LatLng(thisMark.lat(), thisMark.lng()));

    /*ANIMATE THE MARKER PIN*/
    self.setMarkerAnimation(thisMark);

    /*CLOSE THE MENU ON MOBILE FORMAT*/
    self.closeMenu();
  };

  (function() {
    /*CREATE DEFAULT CONTENT FOR INFOWINDOW*/
    infoWindow = new google.maps.InfoWindow({
      content: '<div><h4 id="info-name">This is the title</h4><p id="info-wiki">some information</p></div>',
      maxWidth: 350
    });

    /*CREATE MARKERS*/
    myMarkers.forEach(function(markItem) {
      self.MarkerList.push( new Marker(markItem) );
    });

    /*CREATE CLICK FUNCTION FOR EACH MARKER*/
    self.MarkerList().forEach(function(thisMark) {
      google.maps.event.addListener(thisMark.marker(), 'click', function() {
        self.markerClick(thisMark);
      });
    });

    /*GET INSTAGRAM API IMAGES FOR EACH MARKER*/
    for (var i = 0; i < MarkerList().length; i++) {
      self.getInstaPics(self.MarkerList()[i]);
    }
  })();
};

var init = function() {
  /*INITIALISE THE MAP ON THE PAGE*/
  var mapOptions = {
        center: {lat: 25.1671463, lng: 55.2085706 },
        zoom: 11,
        scrollwheel: true,
        draggable: true,
        mapTypeControl: false
  };

  map = new google.maps.Map(document.getElementById('MapArea'), mapOptions);

  ko.applyBindings(ViewModel);
};