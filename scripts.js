
var zgcurrent = 1;
var zgfilter = "";
var chartlabels = ["paper items", "plastic", "other (metals, glass, organic, etc.)"];

//page navigation
$(".page-item").on("click", function(event) {

  var zgnavigation = event.target.innerText;

  if(zgnavigation >= "1" && zgnavigation <= "99999") {
    pageid = Number(zgnavigation);
  }
  else if(zgnavigation == "«") {
    pageid = zgcurrent - 3;
  }
  else if(zgnavigation == "»") {
    pageid = zgcurrent + 3;
  };

  journalitems(pageid);

});

//populate journal
function journalitems(pageid){

  var zglast = 1;

  if( pageid == 1 ) {
    $('.zgpage').text(function(n) {
      return n + 1;
    });
  }

  $("#pageprevious").removeClass("disabled");
  $("#pagenext").removeClass("disabled");
  $(".zgitem").show();

  var journalitems = journalentries.filter(element => {
    return element.description.toLowerCase().includes(zgfilter.toLowerCase()) || 
      element.title.toLowerCase().includes(zgfilter.toLowerCase()) || 
      element.type.toLowerCase() == zgfilter.toLowerCase() || 
      element.tags.toString().toLowerCase().includes(zgfilter.toLowerCase()) 
  });

  var zgstart = pageid - ((pageid + 2) % 3);
  
  if(journalitems.length == 0) {
    zglast = 1;
  }
  else {
    zglast = Math.floor((journalitems.length + 2) / 3);
  };

  if(pageid > zglast) {
    pageid = zglast;
  };

  var journaldisplay = journalitems.filter((value, index) => index >= pageid * 3 - 3 && index < pageid * 3);

  $(".journal-item").remove();

  for(var zgitem = 0; zgitem < journaldisplay.length && zgitem < 3; zgitem++) {
    var zgtags = journaldisplay[zgitem].tags;
    var zgHTML = "\
      <div class='journal-item'><div data-nosnippet class='journal-headings'><p class='journal-time'>" + journaldisplay[zgitem].date + "</p>\
        <p class='journal-title'>" + journaldisplay[zgitem].title + "</p></div>\
        <p class='journal-details'>" + journaldisplay[zgitem].description + "</p>"
    if(zgtags.length > 0) {
      zgHTML = zgHTML + "<div data-nosnippet class='journal-footings'><p class='journal-tags'><i>tags:</i>  ";
      for(var journaltag = 0; journaltag < zgtags.length; journaltag++) {
        zgHTML = zgHTML + "\
          <a href=\"javascript:void(0)\" onclick=\"searchitems('" + zgtags[journaltag].toString() + "')\">" 
            + zgtags[journaltag].toString() + "</a>" + (journaltag < zgtags.length - 1 ? ", " : "" );
      };
      zgHTML = zgHTML + "</p></div>";
    } else {
      zgHTML = zgHTML + "<br><br>";
    }; 
    zgHTML = zgHTML + "\
      </div>\
    ";
    $(".journal-entries").append(zgHTML);
  };

  //add charts
  $(".zgstatus").each(function(chartindex, journalchart) {  
    var zgdate = journalchart.parentElement.parentElement.parentElement.children[0].children[0].innerText;
    var journalcharts = journalitems.filter((element, index) => index >= journalitems.findIndex(element => element.date == zgdate) && element.chart.length > 0);
    chartdatasets = [];

    $(chartlabels).each(function(labelindex, chartlabel) {
      chartdata = [];
      for(var zgchart = 0; zgchart < journalcharts.length && zgchart < 6; zgchart++) {
        chartdata.push(journalcharts[zgchart].chart[labelindex]);
      };
      chartdata = chartdata.reverse();
      chartdatasets.push({data: chartdata, label: chartlabel});
    });

    new Chart(journalchart, { type: 'line', data: {labels: ['', '', '', '', '', ''], datasets: chartdatasets},
      options: { scales: { y: { beginAtZero: true } }, responsive: true, maintainAspectRatio: false, aspectRatio: [2 - (chartindex % 2)], animation: {duration: 15}}
    });
  });

  //navigation buttons
  $('.zgpage').text(function(n) {
    return zgstart + n;
  });

  if(zgstart == 1) {
    $("#pageprevious").addClass("disabled");
  };
  if(zgstart + 3 > zglast) {
    $("#pagenext").addClass("disabled");
  };
  $(".zgitem:gt(" + (zglast - zgstart) + ")").hide();

  zgcurrent = pageid;

  //set htmls
  $(".link-text").html("📝 <a href='./contact.html' class=\"contact-link\">contact me</a>");
  $(".nrlines-text").html("This site conserves code! <u>446</u> lines as of 6/11/2023.");

};

//search
function searchitems(filterfor) {
  zgfilter = filterfor;
  journalitems(1);   
};

$("#zgsearch").on("click", function(event) {
  zgfilter = $("#zginput").val();  
  journalitems(1);   
});

$('#zginput').keypress(function(event){
  if (event.which == 13) {
    $("#zgsearch").click();
  };
});

window.onload = journalitems(1);