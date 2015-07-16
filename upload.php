<?php 
$fn = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);
$link = (isset($_SERVER['HTTP_X_FILELINK']) ? $_SERVER['HTTP_X_FILELINK'] : false);

date_default_timezone_set("Asia/Hong_Kong"); 

if (isset($fn) and $link != "undefined"){
  /*
    AJAX call
    If filename does not exist, the file is created. Otherwise, the existing file is overwritten, unless the FILE_APPEND flag is set.\
  */
  file_put_contents(
    'uploads/'.time(). $fn,
  /*
    file_get_contents() returns the file in a string, starting at the specified offset up to maxlen bytes. On failure, file_get_contents() will return FALSE.
    php://input is a read-only stream that allows you to read raw data from the request body
    php://input is not available with enctype="multipart/form-data". 
  */
    //file_get_contents('php://input')
    file_get_contents($link)
  );
  //echo file_get_contents($link);
  echo "$fn uploaded";
  exit();  
}

elseif (isset($fn)) {
  file_put_contents(
    'uploads/'.time(). $fn,
    file_get_contents('php://input')
    );
  echo "$fn uploaded";
  exit();
}

else {

  // form submit
  /* 
    ref: http://us2.php.net/manual/en/faq.html.php#faq.html.arrays
    To get my <form> result sent as an array to my PHP script I name the <input>, <select> or <textarea> elements like this: fileselect[]
  */
  $files = $_FILES['fileselect'];
  foreach ($files['error'] as $id => $err) {
   /* 
    check error massage, UPLOAD_ERR_OK have value 0, means that there is no error. 
    Ref:http://php.net/manual/zh/features.file-upload.errors.php
  */
   // echo is_uploaded_file($_FILES['fileselect']['tmp_name'][$id]); check whether it is a POST Request

    if ($err == UPLOAD_ERR_OK) {
      $fn = $files['name'][$id];
      move_uploaded_file(
        $files['tmp_name'][$id],
        'uploads/' .time(). $fn
      );
      echo "<p>File $fn uploaded.</p>";
    }
  }

}
?>