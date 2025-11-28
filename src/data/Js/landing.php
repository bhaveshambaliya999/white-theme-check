<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php
  $ogTitle = isset($_GET['og_title']) ? htmlspecialchars($_GET['og_title']) : 'Default Title';
  $ogDescription = isset($_GET['og_description']) ? htmlspecialchars($_GET['og_description']) : 'Default Description';
  $ogImage = isset($_GET['og_image']) ? htmlspecialchars($_GET['og_image']) : 'https://example.com/default-image.jpg';
  $ogUrl = isset($_GET['ext_url']) ? htmlspecialchars($_GET['ext_url']) : 'Default Url';
 
  if(isset($_SERVER['HTTP_REFERER'])) {
        $referer = $_SERVER['HTTP_REFERER'];
        $call = strpos($referer, 'facebook.com');
        // if(strpos($referer, 'facebook.com') === true){
           header("Location: $ogUrl");
        // }
    }
  ?>
  <meta property="og:title" content="<?php echo $ogTitle; ?>">
  <meta property="og:description" content="<?php echo $ogDescription; ?>">
  <meta property="og:image" content="<?php echo $ogImage; ?>">
  <meta property="og:url" content="<?php echo $ogUrl; ?>">
  <meta property="og:type" content="website">

</head>
<body>
 Welcome 
</body>
</html>