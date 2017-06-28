  var channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

// on load get ajax from twitch
$(function () {
  channels.forEach(function (val, index, arry) {
    getStreams(val); // channels or streams
  });

});

function getStreams(val, dataType="channels", newObj) {
    jQuery.ajax(`https://wind-bow.gomix.me/twitch-api/${dataType}/` + val, {
      method: "GET",
      dataType: "jsonp",
      mimeType: "Accept: application/vnd.twitchtv.v5+jsonp",
      success: function (data) {
          displayStream(data, dataType, newObj);
      }
    });
}


// display ajax request using default streamers

function displayStream(data, dataType, newObj) {
// debugger;
  if(dataType === "channels") {
    var myObj = isStreaming( {}, data, dataType);
    getStreams(myObj.name, "streams", myObj);
  } else if(dataType === "streams") {
    return isStreaming(newObj, data, dataType);
  }
  // console.log(myObj);

  // var streamStatus = (bio === "offline") ? bio : "online";
  var active = myObj.streaming;
  console.log("HELP");
  console.log(myObj);
  console.log("--------------");  
  var HTMLTemplate = `<a class="stream-link" href="${myObj.href}">
                 <div class="stream ${(active === undefined) ? 'offline' : 'online'}">
                    <div class="streamer-img">
                        <img src="${myObj.logo}" alt="${myObj.name}'s Bio Image">
                    </div>
                    <div class="stream-info">
                        <h4>${myObj.name}</h4>
                        <p class="now-playing">Now Playing: <span>${myObj.game}</span></p>
                        <p class="followers">Followers: <span>${myObj.followers}</span></p>
                        <p class="viewer-numbers">Views: <span>${myObj.views}</span></p>
                        <p class="total-views">Total Views: <span>${myObj.totalViewers}</span></p>
                    </div>
                </div>   
                </a>`
  $("section.streams-container").append(HTMLTemplate);
}

// change box-color at top right of div if streaming or not
// if streaming animate box to pulsate

// revecie data and return obj to use in HTML template
// channels or stream
function isStreaming(myObj, data, dataType) {
  if(dataType === "channels"){
    return {
      logo: data.logo || "http://hydra-media.cursecdn.com/guildwiki.gamepedia.com/thumb/a/ac/No_image_available.svg/512px-No_image_available.svg.png?version=da06fddcdd06470a79a998b6e7be11fc",
      name: data.name,
      url: data.url,
      views: data.views.toString()
                .split('')
                .reverse()
                .map(function (val, i, arry) {
                  return ( ( (i+1)%3 === 0) && (i+1 !== arry.length)) ? (','+val) : val;
                })
                .reverse()
                .join(''),
      followers: data.followers
    };
  } else {
    if(data.stream == null){ return undefined; }
    myObj.game = data.stream.game || undefined;
    myObj.viewing = data.stream.viewers || undefined;
    myObj.streaming = data.stream.stream_type || undefined;
    return myObj;
  }

}


// add active class to selected tab
$('.tabs ul li').on("click", function(e){
  $(this).parent().find(".active").removeClass('active');
  $(this).addClass("active");
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
