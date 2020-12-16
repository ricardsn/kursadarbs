define([
    'jquery',
], function(
    $
) {
   window.onscroll = () => {
       if (window.scrollY > 500) {
           $('.hook').show("fast");
       } else {
           $('.hook').hide("fast");
       }
   }

   $('.hook').on('click', function () {
       $("html, body").animate({ scrollTop: "0" });
   });
});
