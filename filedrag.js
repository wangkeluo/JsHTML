(function() {

  // get element by ID
  function $id(id) {
    return document.getElementById(id);
  }
  // output information
  function Output(msg) {
    var m = $id("messages");
    m.innerHTML = msg + m.innerHTML;
  }
  // file drag hover
  function FileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.target.className = (e.type == "dragover" ? "hover" : "");
  }

  // file selection
  function FileSelectHandler(e) {

    // cancel event and hover styling
    FileDragHover(e);

    // fetch FileList object, either from the file input box(e.target.files) or #filedrag element(e.dataTransfer.files)
    var files = e.target.files || e.dataTransfer.files;

    // process all File objects
    for (var i = 0, numFiles = files.length; i < numFiles; i++) {
      f= files[i];
      ParseFile(f);
    }

  }

  function ParseFile(file) {

    Output(
      "<p>File information: <strong>" + file.name +
      "</strong> type: <strong>" + file.type +
      "</strong> size: <strong>" + file.size +
      "</strong> bytes</p>"
    );

    // display text
    if (file.type.indexOf("text") === 0) {
      var reader = new FileReader();
      reader.onload = function(e) {
        Output(
          "<p><strong>" + file.name + ":</strong></p><pre>" +
          e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
          "</pre>"
        );
      };
      reader.readAsText(file);
    }

    // display an image
    if (file.type.indexOf("image") === 0) {
      var reader = new FileReader();
      reader.onload = function(e) {
        Output(
          "<p><strong>" + file.name + ":</strong><br />" +
          '<img src="' + e.target.result + '" /></p>'
        );
      };
      reader.readAsDataURL(file);
    }
/*
    if (file.type.indexOf("application") === 0) {
      var reader = new FileReader();
      reader.onload = function(e) {
        Output(
          "<p><strong>" + file.name + ":</strong><br />" +
          '<img src="' + e.target.result + '" /></p>'
        );
      };
      reader.readAsBinaryString(file);
    }
*/
  }



  function Init() {

    var fileselect = $id("fileselect"),
      filedrag = $id("filedrag"),
      submitbutton = $id("submitbutton");

    // file select
    fileselect.addEventListener("change", FileSelectHandler, false);

    // is XHR2 available?
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {

      // file drop
      filedrag.addEventListener("dragover", FileDragHover, false);
      filedrag.addEventListener("dragleave", FileDragHover, false);
      filedrag.addEventListener("drop", FileSelectHandler, false);
      filedrag.style.display = "block";

      // remove submit button
      submitbutton.style.display = "none";
    }

  }

  // call initialiazation file if W3C File api is valid
  if (window.File && window.FileList && window.FileReader) {
    Init();
  }


})();