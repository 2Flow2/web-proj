var consolesCounter = 1;
var activeTab = null;
consoles = [];
var overscrollAdded = false;
var releaseInfoCounter = 1;
var usingTouch = false;
$(document).ready(function(){

  $("#locationPlus").click(function(){
    addInput("releaseInfo");
  });

  $("#consolesPlus").click(function(){
    addInput("consoles");
  });

  $('[name="consoles"]').change(addConsole);

  $('body').on('click touchend', function(event){
    if (event.type != 'click'){
      usingTouch = true;
      if (overscrollAdded = true){
        $('#boxArtTabsRow').removeOverscroll();
        overscrollAdded = false;
      }
    }
  });
});

/**/
function consoleSelected(callingElement){
  var name = callingElement.name;
  var newConsole = callingElement.value;
  var currentConsole = $('[name="' + name + '"]').attr("alt");
  if (currentConsole != "none"){
    removeConsole(currentConsole);
  }
  addConsole(newConsole);
  $('[name="' + name + '"]').attr("alt", newConsole);
}//end consoleSelected

/*Adds a console to the array of consoles and alphabetizes it*/
function addConsoleToArray(consoleName){
  consoles.push(consoleName);
  consoles.sort();
}//end addConsoleToArray

/*Removes a console from the array and alphabetizes it*/
function removeConsoleFromArray(consoleName){
  consoles.splice(consoles.indexOf(consoleName), 1);
  consoles.sort();
}//end removeConsoleFromArray

/*Adds a tab and hidden box art div for the passed console*/
function addConsole(consoleName){
  addConsoleToArray(consoleName);
  $('#boxArtTabsRow').append("<div class='consoleTab' onclick='selectImageTab(this)' id='" + consoleName + "Tab'>" + consoleName + "</div>");
  copyHeight("boxArtBanner", "boxArtTabsRow", -6);
  $('#boxArt').append('<div id="' + consoleName + 'BoxArt" style="display:none;"><input type="button" value="Choose File"></input></div>');
  if (overscrollAdded == false && usingTouch == false){
    $('#boxArtTabsRow').overscroll({showThumbs:'false', direction:'horizontal'});
    overscrollAdded = true;
  }
}//end addConsole

/*Removes the tab and box art div for the passed console*/
function removeConsole(consoleName){
  removeConsoleFromArray(consoleName);
  $('[id="' + consoleName + 'Tab"]').remove();
  $('[id="' + consoleName + 'BoxArt"]').remove();
  copyHeight("boxArtBanner", "boxArtTabsRow");
}//end removeConsole()

/*This function is unused because all values in the <option> tags are now stored with uppercases, but keeping this function around in case it is ever needed.*/
function capitalizeString(string) {
  for (i=0; i<string.length;i++){
    if (i == 0){
      var char = string.charAt(i);
      char = char.toUpperCase();
      stringArray = string.split("");
      stringArray[i] = char;
      string = stringArray.join("");
    }
    else if ((string.charAt(i) == " ") || (string.charAt(i) == '-') || (string.charAt(i) == '/')){
      var char = string.charAt(i+1);
      char = char.toUpperCase();
      stringArray = string.split("");
      stringArray[i+1] = char;
      string = stringArray.join("");
    }
  }
  return string;
}//end capitalizeString

/*The function that actually copies the text from a releaseLocation textbox and has it appear in the span next to the corresponding releaseDate textbox.*/
function copyText(callingName, receivingName){
  var releaseLocationDiv = $('[name=' + callingName +']');
  var releaseLocationSpan = $("#" + receivingName);
  releaseLocationSpan.text(releaseLocationDiv.val());
}//end copyText()

/*Checks if the list name passed matches a valid text document then adds all items in that text document to the list with that name attribute.*/
function populateList(listName, toPopulate){ //Find a way to server-side log the error if this tries to access a file that does not exist (don't let it print to the console).
    var listFile = "txt/" + listName + "List.txt";
    $.get(listFile, function(data){
      values = data.split(/\r/);
      for (i = 0; i<(values.length);i++){
        var stringAsArray = values[i].split("");
        if (stringAsArray[0] == "\n"){ //Remove any carriage returns that are at the beginnings of the strings
          stringAsArray.splice(0,1);
        }
        values[i] = stringAsArray.join("");
        values[i] = '<option value="' + values[i] + '">' + values[i] + '</option>';
        $('[name="'+toPopulate+'"]').append(values[i]);
      }
    });
}//end populateList()

/*Get the height from one element and set that as the height of another element. If a third argument is passed, adds that much extra to the new height*/
function copyHeight(reciever, original, modification){
  original = document.getElementById(original);
  reciever = document.getElementById(reciever);
  var heightValue = original.clientHeight;
  if (modification)
    heightValue = heightValue + modification;
  reciever.style.height = (heightValue + "px");
}//end copyHeight()

/*Highlights the passed tab and un-hides its associated box art div TO-DO: Have it un-highlight the currently highlighted tab*/
function selectImageTab(tab){
  var consoleName = tab.innerHTML;
  tab.style['background-color'] = "rgb(149, 149, 160)";
  tab.style['border-bottom'] = "2px solid rgb(149, 149, 160)";
  $('[id="' + consoleName + 'BoxArt"]').css("display", "initial");
  if (activeTab != null){
    var currentlySelected = this.activeTab; //Have to use "this" keyword to circumvent hoisting
    $('[id="' + currentlySelected +'Tab"]').css("background-color", "");
    $('[id="' + currentlySelected +'Tab"]').css("border-bottom", "");
    $('[id="' + currentlySelected +'BoxArt"]').css("display", "none");
  }
  activeTab = consoleName;
}//end selectImageTab()

/*Adds more textboxes or select-boxes and gives them a unique name*/
function addInput(inputType){
  if (inputType == "releaseInfo"){
    $("#releaseLocationsColumn").append("<div class='singleInputContainer'><input type='text' name='releaseLocation" + releaseInfoCounter + "' onkeyup='copyText(&quot;releaseLocation" + releaseInfoCounter + "&quot;, &quot;releaseLocation" + releaseInfoCounter + "Span&quot;)'></div>");
    $("#releaseDatesColumn").append("<div class='singleInputContainer'><input type='text' name='releaseDate" + releaseInfoCounter + "'> in <span id='releaseLocation" + releaseInfoCounter+ "Span'></span></div>");
    $('[name="releaseLocation' + releaseInfoCounter + '"]').focus();
    releaseInfoCounter++;
  }
  if (inputType == "consoles"){
    $("#consolesColumn").append("<div class='singleInputContainer'><select name='console" + consolesCounter + "' onchange='consoleSelected(this)' alt='none'><script>populateList('consoles', 'console" + consolesCounter + "');</script><option disabled selected style='display:none;'></select></div>");
    consolesCounter++;
  }
}
