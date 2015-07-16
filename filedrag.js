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

  function UploadFile(file) {
    var xhr = new XMLHttpRequest();
    // it is a better practice that put file size check on server side,ie,php.
    if (xhr.upload ) {
      // create progress bar
      var o = $id("progress");
      var progress = o.appendChild(document.createElement("p"));
      progress.appendChild(document.createTextNode("upload " + file.name));


      // progress bar
      xhr.upload.addEventListener("progress", function(e) {
        var pc = parseInt(100 - (e.loaded / e.total * 100));
        progress.style.backgroundPosition = pc + "% 0";
      }, false);

      // file received/failed
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4) {
          progress.className = (xhr.status == 200 ? "success" : "failure");
          console.log(xhr.responseText);
        }
      };
      //ajax
      xhr.open("POST", $id("upload").action, true);
      xhr.setRequestHeader("X-FILENAME", file.name);
      xhr.setRequestHeader("X-FILELINK", file.link);
      xhr.send(file);

    } else {
      Output("<p>File is over size.</p>");
    }
  }

  function InitDropBox() {
    // dropbox option setting
    options = {

      // Required. Called when a user selects an item in the Chooser.
      success: function(files) {
        // do some thing
         for (var i = files.length -1; i >= 0; i--) {
          UploadFile(files[i]);
         };
        //alert("Here's the file link: " + files[0].link)
      },

      // Optional. Called when the user closes the dialog without selecting a file
      // and does not include any parameters.
      cancel: function() {

      },
      // Optional. "preview" (default) is a preview link to the document for sharing,
      // "direct" is an expiring link to download the contents of the file. For more
      // information about link types, see Link types below.
      linkType: "direct", // or "direct"

      // Optional. A value of false (default) limits selection to a single file, while
      // true enables multiple file selection.
      multiselect: true, // or true

      // Optional. This is a list of file extensions. If specified, the user will
      // only be able to select files with these extensions. You may also specify
      // file types, such as "video" or "images" in the list. For more information,
      // see File types below. By default, all extensions are allowed.
      extensions: ['.pdf', '.doc', '.docx', '.png'],
    };
    var button = Dropbox.createChooseButton(options);
    document.getElementById("dropbox").appendChild(button);
  }

  // file selection
  function FileSelectHandler(e) {

    // cancel event and hover styling
    FileDragHover(e);

    // fetch FileList object, either from the file input box(e.target.files) or #filedrag element(e.dataTransfer.files)
    var files = e.target.files || e.dataTransfer.files;

    // process all File objects
    for (var i = 0, numFiles = files.length; i < numFiles; i++) {
      f = files[i];
      ParseFile(f);
      //console.log("File shown");
      UploadFile(f);
      //console.log("file upload");
    }

  }

  function Init() {
    InitDropBox();
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