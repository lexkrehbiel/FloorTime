<!-- Performs file upload  -->
<?php

echo "<div class=\"container\">";

// Target directory
$target_dir = "/Users/lexieKrehbiel/Documents/SrProject/upload/";

// file name
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

// status of upload
$uploadOk = 1;

//file type
$fileType = pathinfo($target_file,PATHINFO_EXTENSION);

// Check if file already exists
if (file_exists($target_file)) {
    echo "<div class=\"alert alert-danger\">Sorry, file already exists.</div>";
    $uploadOk = 0;
}
// Check file size
else if ($_FILES["fileToUpload"]["size"] > 500000) {
    echo "<div class=\"alert alert-danger\">Sorry, your file is too large.</div>";
    $uploadOk = 0;
}
else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        echo "<div class=\"alert alert-success\">The file ". basename( $_FILES["fileToUpload"]["name"]). " has been uploaded.</div>";
    } else {
        echo "<div class=\"alert alert-danger\">Sorry, there was an error uploading your file.</div>";
    }
}

echo "</div>";
?>

<!-- Show the pie chart  -->
<html>
  <head>
    <!-- JQuery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <!-- Google charts API  -->
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

    <!-- load the JS from the piechart page -->
    <script type="text/javascript" src="piechart.js"></script>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Bootstrap JS -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

  </head>
  <body>
    <div class="container">
    <!-- show chart -->
    <div id="piechart" style=""></div>

  </div>
  </body>
</html>
