'use strict'
$(document).ready(function () {
  let url = window.location.href;
  $.get({
    url: '/courseware/list',
    success: (data) => {
      let html = "";
      for (let course_id = 1, dLen = data.data.length; course_id <= dLen; course_id++) {
        if (data.data[course_id - 1].status == true) {
          html += '<a class="list-group-item" href="' + url + '/file/course' + course_id + '" download>' + "No." + course_id + "：" + data.data[course_id - 1].course_name + '</a>';
        }
      }
      $('#course-list').append(html);
    }
  });
  console.log("get list suc");
})
  .on('mouseover', '.list-group-item', async function () {
    $(".list-group-item").removeClass("active");
    $(this).addClass("active")
  })