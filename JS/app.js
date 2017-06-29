var onlineStreams = [];
var offlineStreams = [];
var newChannelName = "";

// on dosument ready 
$(function () {

  var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "monstercat" , "freecodecamp", "shoutfactorytv", "habathcx", "RobotCaleb", "LawBreakers", "noobs2ninjas", "streamerhouse"];

  channels.forEach(function (val, index, arry) {
    getStreams(val, index);
  });

});

function getStreams(val, i) {
  jQuery.ajax(`https://wind-bow.gomix.me/twitch-api/channels/` + val, {
    method: "GET",
    dataType: "jsonp",
    mimeType: "Accept: application/vnd.twitchtv.v5+jsonp",
    success: function (data) {
      var streamInfo = getStreamDetails(data, "channels");
      var template = printBaseChannelDetails(streamInfo, i);
      getStreamsInfo(streamInfo, template, i);
    }
  });
}

function getStreamsInfo(streamInfo, template, i) {
  jQuery.ajax(`https://wind-bow.gomix.me/twitch-api/streams/` + streamInfo.name, {
    method: "GET",
    dataType: "jsonp",
    mimeType: "Accept: application/vnd.twitchtv.v5+jsonp",
    success: function (data) {
      var obj = getStreamDetails(data, "streams");
      displayWhenStreaming(template, obj, i);
    }
  });
}

// displays basic info of streamer fron /channels request
function printBaseChannelDetails(obj, i) {
  var HTMLTemplate = `<a data-count${i}="val" class="stream-link" href="${obj.url}" target="_blank">
                <div class="stream">
                  <div class="streamer-img">
                      <img src="${obj.logo}" alt="${obj.name}'s Bio Image">
                  </div>
                  <div class="stream-info">
                      <h4>${obj.name}</h4>
                       <p class="followers">Followers: <span>${obj.followers}</span></p>
                      <p class="viewer-numbers">Total Views: <span>${obj.views}</span></p>`
  //     </div>
  // </div>   
  // </a>`
  $("section.streams-container").append(HTMLTemplate);
  return HTMLTemplate;

}

// recieves streaming JSON and appends to html if channel is streaming
function displayWhenStreaming(template, obj, i) {

  var live = (!obj) ? "offline" : "online";

  if (obj === undefined) {
    // add to displayed items
    $("a[data-count" + i + "]").find("div.stream").addClass(live);
    storeStreamStatus(i);
    return undefined;
  }
  var HTMLTemplate = `<p class="now-playing">Now Playing:
                         <span>${obj.game || live}</span>
                      </p>
                      <p class="total-views">Watching:
                       <span>${obj.viewing || live}</span>
                      </p>`
  $("a[data-count" + i + "]").find("div.stream").addClass(live);
  $("a[data-count" + i + "]").find(".stream-info").append(HTMLTemplate);

  storeStreamStatus(i);
}


// receives data and returns obj to use in HTML template
function getStreamDetails(data, dataType) {
  if (dataType === "channels") {
    return {
      logo: data.logo || "http://hydra-media.cursecdn.com/guildwiki.gamepedia.com/thumb/a/ac/No_image_available.svg/512px-No_image_available.svg.png?version=da06fddcdd06470a79a998b6e7be11fc",
      name: data.display_name,
      url: data.url,
      views: data.views.toString()
        .split('')
        .reverse()
        .map(function (val, i, arry) {
          return (((i + 1) % 3 === 0) && (i + 1 !== arry.length)) ? (',' + val) : val;
        }).reverse().join(''),
      followers: data.followers
    };
  } else {
    if (data.stream == null) {
      return undefined;
    }
    return {
      game: data.stream.game,
      viewing: data.stream.viewers,
      streaming: data.stream.stream_type
    };
  }
}

// stores list of online and offline streams
// called at every insersion into DOM
function storeStreamStatus(i) {
  var stream = document.querySelector("a[data-count" + i + "]");

  if ($(stream).find("div.stream").is(".online")) {
    onlineStreams.push(stream.outerHTML)
  }

  if ($(stream).find("div.stream").is(".offline")) {
    offlineStreams.push(stream.outerHTML)
  }
}

// add active class to selected tab
$('.tabs ul li').on("click", function (e) {
  
  //TODO: If tab os active, skip function and do nothing
  if($(this).is(".active")){ return; }

  $(this).parent().find(".active").removeClass('active');
  $(this).addClass("active");
  var allStreams = onlineStreams.concat(offlineStreams);

  // empty html of container
  var container = $("section.streams-container");
  container.html("");
  $("#search-bar").prop("placeholder", "Search");


  // print relevant streams
  if ($(this).text() === "All") {
    allStreams.forEach(function (val) {
      container.append(val);
    });
  } else if ($(this).text() === "Online") {
    onlineStreams.forEach(function (val) {
      container.append(val);
    });
  } else if ($(this).text() === "Offline") {
    offlineStreams.forEach(function (val) {
      container.append(val);
    });
  } else {
    var searchBar = $("#search-bar");
    searchBar.val("");
    searchBar.prop("placeholder", "Add New Channel");
  }
});

// live search as user inputs data
$("#search-bar").on("keyup paste", function (e) {
  var active = $(".active");
  if (active.text() === "All") {
    liveSearch(0, $(this).val());
  } else if (active.text() === "Online") {
    liveSearch(1, $(this).val());
  } else if (active.text() === "Offline") {
    liveSearch(2, $(this).val());
  }
});

// serach for user on enter key pressed
$("#search-bar").on("keydown", function (e) {

  if ($(".active").text() === "Add Channel") {
    if (e.keyCode === 13) {
      $(".streams-container").html("");
      addNewChannel($(this).val())
    }
  }
});

// hides the search icon on focus
$("#search-bar").on("focus", function (e) {
  $(".fa-search").css("opacity", "0")
})
$("#search-bar").on("blur", function (e) {
  $(".fa-search").css("opacity", "1")
})

$("form").on("submit", function (e) {
  e.preventDefault();
});

// insantly updates search result on new search terms
function liveSearch(tab, query) {

  var allStreams = onlineStreams.concat(offlineStreams);
  var container = $("section.streams-container");
  container.html('');
  var re = new RegExp(query);

  if (tab === 0) {
    allStreams.forEach(function (val, i) {
      findAndAppend(val);
    });
  } else if (tab === 1) {
    onlineStreams.forEach(function (val, i) {
      findAndAppend(val);

    });
  } else if (tab === 2) {
    offlineStreams.forEach(function (val, i) {
      findAndAppend(val);
    });
  }

  function findAndAppend(val) {
    var item = $(val);
    if (item.find("h4").text().search(re) !== -1) {
      container.append(val);
    }
  }
}




// seraches for new channel and displays it
function addNewChannel(query) {
  var searchBar = $("#search-bar");
  searchBar.val("");

  getUser(query);

  function getUser(user) {
    jQuery.ajax(`https://wind-bow.gomix.me/twitch-api/users/` + user, {
      method: "GET",
      dataType: "jsonp",
      mimeType: "Accept: application/vnd.twitchtv.v5+jsonp",
      success: function (JSON) {

        var HTMLTemplate;
        var imgPlaceHolder = `http://hydra-media.cursecdn.com/guildwiki.gamepedia.com/thumb/a/ac/No_image_available.svg/512px-No_image_available.svg.png?version=da06fddcdd06470a79a998b6e7be11fc`;

        if (JSON.status === 404 || JSON.status === 422) {
          $(".streams-container").html(JSON.message);
        } else {
          HTMLTemplate = `<a class="stream-link">
              <div class="stream">
                <div class="streamer-img">
                    <img src="${JSON.logo || imgPlaceHolder }" alt="${JSON.display_name}'s Logo">
                </div>
                <div class="stream-info">
                    <h4>${JSON.display_name}</h4>
                    <button class="add-btn">Add</button>`
          newChannelName = JSON.name;
          $(".streams-container").append(HTMLTemplate);
          attachEventToButton();
        }
      }
    });
  }
}

function attachEventToButton() {
  $(".add-btn").on("click", function (e) {
    var container = $(".streams-container")
    container.html(" ");
    var allStreams = onlineStreams.concat(offlineStreams);

    var check = false;

    for (var val of allStreams) {
      check = inArray(val, newChannelName);
      if (check) {
        break;
      }
    }
    
    if (check) {
      container.append(`<h1 style="margin-top: 20px; text-align: center;"> Channel Already in Collection`);
      return;
    }

    getStreams(newChannelName);
    $(".streams-container").append(`<h1 style="margin-top: 20px; text-align: center;"> New Channel Added`);

  });
}

function inArray(val, channel) {
  var item = $(val).find("h4").text();

  if (item === channel) {
    return true;
  }
  return false;
}


// change displayed streams based on streaming info

// search bar should filter results based on search

// results should be filtered based on tab user is currently on

// add channel tab-> uses different ajax request to search for user

// add channel tab-> display serach results in stream container
// show name and image of streamer, with viewer info and button to add
// adding new streamers should display a message indicating success


// switching tabs should reset view and display info for related tab
// should also clear out search bar