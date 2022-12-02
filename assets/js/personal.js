jQuery(function() {
  // 隐藏顶部和底部
  $(".site-header-nav").attr("style", "display:none;");
  $(".site-footer").attr("style", "display:none;");
  $(".collapsed").attr("style", "display:none;");
   
  $(".collection-info").attr("style", "display:none;");
  
  $("#title").attr("href", "/personal");
  
  //禁用搜索框
  $("#search_box").attr("disabled", "true");
  
});
