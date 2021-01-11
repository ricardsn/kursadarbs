define([
    'jquery',
], function(
    $
) {
   window.onscroll = () => { //adding scroll top possibility
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
