var onlineStreams = [];
var offlineStreams = [];
// on load get ajax from twitch
$(function () {

  // HTML

  var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "LawBreakers", "noobs2ninjas"];



  channels.forEach(function (val, index, arry) {
    getStreams(val, index);
  });
  // storeStreamStatus();

  console.log(onlineStreams);
  console.log("========================")
  console.log(offlineStreams);

});

function getStreams(val, i) {
  jQuery.ajax(`https://wind-bow.gomix.me/twitch-api/channels/` + val, {
    method: "GET",
    dataType: "jsonp",
    mimeType: "Accept: application/vnd.twitchtv.v5+jsonp",
    success: function (data) {
      var streamInfo = isStreaming(data, "channels");
      // console.log(streamInfo);
      var template = printHTMLTemplate_1(streamInfo, i);
      getStreamsInfo(streamInfo, template, i);
    }
  });
}

function getStreamsInfo(streamInfo, template, i) {
  // console.log(streamInfo);
  jQuery.ajax(`https://wind-bow.gomix.me/twitch-api/streams/` + streamInfo.name, {
    method: "GET",
    dataType: "jsonp",
    mimeType: "Accept: application/vnd.twitchtv.v5+jsonp",
    success: function (data) {
      var obj = isStreaming(data, "streams");
      printHTMLTemplate_2(template, obj, i);

    }
  });
}

// displays basic info of streamer
function printHTMLTemplate_1(obj, i) {
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
function printHTMLTemplate_2(template, obj, i) {
  var live = (!obj) ? "offline" : "online";
  if (obj === undefined) {
    // add to displayed items
    $("a[data-count" + i + "]").find("div.stream").addClass(live);

    // var stream = $(template).find(".stream")
    //                         .addClass(live).find(".viewer-numbers")
    //                         .html();
    // // stream = template+stream;
    // console.log(stream);
    // offlineStreams.push(stream);
    storeStreamStatus(i);

    return;
  }
  var HTMLTemplate = `<p class="now-playing">Now Playing:
                         <span>${obj.game || live}</span>
                      </p>
                      <p class="total-views">Watching:
                       <span>${obj.viewing || live}</span>
                      </p>`
  $("a[data-count" + i + "]").find("div.stream").addClass(live);
  $("a[data-count" + i + "]").find(".stream-info").append(HTMLTemplate);
  // onlineStreams.push(HTMLTemplate);
  storeStreamStatus(i);
}

// change box-color at top right of div if streaming or not
// if streaming animate box to pulsate

// receives data and return obj to use in HTML template
function isStreaming(data, dataType) {
  if (dataType === "channels") {
    return {
      logo: data.logo || "http://hydra-media.cursecdn.com/guildwiki.gamepedia.com/thumb/a/ac/No_image_available.svg/512px-No_image_available.svg.png?version=da06fddcdd06470a79a998b6e7be11fc",
      name: data.name,
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
  // console.log(stream.outerHTML)

  if ($(stream).find("div.stream").is(".online")) {
    // console.log(stream.outerHTML)

    onlineStreams.push(stream.outerHTML)
  }

  if ($(stream).find("div.stream").is(".offline")) {
    // console.log(stream.outerHTML)

    offlineStreams.push(stream.outerHTML)
  }

  // streams.forEach(function(val, i) {
  //   // if( $(val).is(".online") ){
  //   //   console.log($(val).find("div.stream").html());
  //   // }
  //   // console.log($(val).html())
  // });
}


// add active class to selected tab
$('.tabs ul li').on("click", function (e) {
  $(this).parent().find(".active").removeClass('active');
  $(this).addClass("active");
  var allStreams = onlineStreams.concat(offlineStreams);

  // empty html of container
  var container = $("section.streams-container");
  container.html("");

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
      // console.log(val);
    });
  }

});

// change displayed streams based on streaming info

// search bar should filter results based on search

// results should be filtered based on tab user is currently on

// add channel tab-> uses different ajax request to search for user

// add channel tab-> display serach results in stream container
// show name and image of streamer, with viewer info and button to add
// adding new streamers should display a message indicating success


// switching tabs should reset view and display info for related tab
// should also clear out search bar