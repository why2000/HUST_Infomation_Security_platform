'use strict'
$(document).ready(function () {
  $.get({
    url: '/courseware/list',
    success: (data) => {
      let html = "";
      for (let course_id = 0, dLen = data.course_name.length; course_id < dLen; course_id++) {
        html += '<button class="list-group-item" c_id=' + course_id + ">" + "No." + (course_id + 1) + "：" + data.course_name[course_id] + '</button>';
      }
      $('#course-list').append(html);
    }
  });

  console.log("get list suc");
})
  .on('mouseover', '.list-group-item', function () {
    $(".list-group-item").removeClass("active");
    $(this).addClass("active")
  })  