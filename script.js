$(document).ready(function () {

  $(window).on("load", function () {
    $("#loader").fadeOut("slow");
  });

  
  $("nav button").not("#toggleTheme").click(function () {
    let target = $(this).attr("id").replace("tab-", "");
    $(".tab-content").hide();
    $("#" + target).show().addClass("animate__animated animate__fadeIn");
  });

  function loadDashboard() {
    $.get("https://jsonplaceholder.typicode.com/users", function (data) {
      $("#usersCount").text("Users: " + data.length);
    });

    $.get("https://jsonplaceholder.typicode.com/posts", function (data) {
      $("#postsCount").text("Posts: " + data.length);
    });

    $.get("https://jsonplaceholder.typicode.com/comments", function (data) {
      $("#commentsCount").text("Comments: " + data.length);
    });
  }
  loadDashboard();



  let favorites = JSON.parse(localStorage.getItem("favUsers") || "[]");

  function loadUsers() {
    $.get("https://jsonplaceholder.typicode.com/users", function (users) {
      let tableBody = "";
      users.forEach((user) => {
        let isFav = favorites.includes(user.id);
        tableBody += `
          <tr data-id="${user.id}">
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.company.name}</td>
            <td>
              <button class="viewBtn"><i class="fa fa-eye"></i></button>
              <button class="editBtn"><i class="fa fa-edit"></i></button>
              <button class="deleteBtn"><i class="fa fa-trash"></i></button>
              <span class="favBtn ${isFav ? "favorite" : "not-favorite"}"><i class="fa fa-star"></i></span>
            </td>
          </tr>`;
      });

      $("#usersTable tbody").html(tableBody);

      if (!$.fn.DataTable.isDataTable("#usersTable")) {
        $("#usersTable").DataTable();
      }
    });
  }

  $("#tab-users").click(function () {
    if ($("#usersTable tbody").is(":empty")) {
      loadUsers();
    }
  });

  $(document).on("click", ".favBtn", function () {
    let row = $(this).closest("tr");
    let userId = row.data("id");

    if (favorites.includes(userId)) {
      favorites = favorites.filter((id) => id !== userId);
      $(this).removeClass("favorite").addClass("not-favorite");
      toastr.info("Removed from favorites");
    } else {
      favorites.push(userId);
      $(this).removeClass("not-favorite").addClass("favorite");
      toastr.success("Added to favorites");
    }

    localStorage.setItem("favUsers", JSON.stringify(favorites));
  });


  $(document).on("click", ".deleteBtn", function () {
    $(this).closest("tr").remove();
    toastr.error("User deleted");
  });

  $(document).on("click", ".viewBtn", function () {
    let name = $(this).closest("tr").find("td:first").text();
    toastr.info("Viewing " + name);
  });

  $(document).on("click", ".editBtn", function () {
    let row = $(this).closest("tr");
    let nameCell = row.find("td:first");
    let currentName = nameCell.text();
    let newName = prompt("Edit name:", currentName);
    if (newName) {
      nameCell.text(newName);
      toastr.success("User updated");
    }
  });


  function loadPosts() {
    $.get("https://jsonplaceholder.typicode.com/posts", function (posts) {
      renderPosts(posts);
    });
  }

  function renderPosts(posts) {
    if (!Array.isArray(posts)) {
      toastr.error("Failed to load posts");
      return;
    }

    if ($.fn.DataTable.isDataTable("#postsTable")) {
      $("#postsTable").DataTable().clear().destroy();
    }

    let table = $("#postsTable").DataTable();

    posts.forEach((post) => {
      let rowNode = table
        .row.add([
          post.id,
          post.title,
          post.body,
          `<button class="viewCommentsBtn"><i class="fa fa-comment"></i></button>
           <button class="editPostBtn"><i class="fa fa-edit"></i></button>
           <button class="deletePostBtn"><i class="fa fa-trash"></i></button>`,
        ])
        .draw()
        .node();

      $(rowNode).attr("data-id", post.id);
    });
  }


  $("#addPostBtn").click(function () {
    let title = prompt("Enter post title:");
    let body = prompt("Enter post body:");

    if (title && body) {
      let newId = Date.now();

      let rowNode = $("#postsTable")
        .DataTable()
        .row.add([
          newId,
          title,
          body,
          `<button class="viewCommentsBtn"><i class="fa fa-comment"></i></button>
           <button class="editPostBtn"><i class="fa fa-edit"></i></button>
           <button class="deletePostBtn"><i class="fa fa-trash"></i></button>`,
        ])
        .draw()
        .node();

      $(rowNode).attr("data-id", newId);

      toastr.success("Post added successfully!");
    }
  });

  
  $(document).on("click", ".editPostBtn", function () {
    let row = $(this).closest("tr");
    let titleCell = row.find("td:eq(1)");
    let bodyCell = row.find("td:eq(2)");

    let newTitle = prompt("Edit title:", titleCell.text());
    let newBody = prompt("Edit body:", bodyCell.text());

    if (newTitle && newBody) {
      titleCell.text(newTitle);
      bodyCell.text(newBody);
      toastr.success("Post updated!");
    }
  });


  $(document).on("click", ".deletePostBtn", function () {
    $(this).closest("tr").remove();
    toastr.error("Post deleted!");
  });


  $(document).on("click", ".viewCommentsBtn", function () {
    let postId = $(this).closest("tr").data("id");

    $.get(
      `https://jsonplaceholder.typicode.com/comments?postId=${postId}`,
      function (comments) {
        let commentsText = comments
          .map((c) => `💬 ${c.email}: ${c.body}`)
          .join("\n\n");
        alert("Comments for Post " + postId + ":\n\n" + commentsText);
      }
    );
  });

  $("#tab-posts").click(function () {
    if ($("#postsTable tbody").is(":empty")) {
      loadPosts();
    }
  });


  $("#toggleTheme").click(function () {
    $("body").toggleClass("dark");
    toastr.info("Theme switched!");
  });

  $(document).ready(function () {
  $("#loader").fadeOut("slow");
});


setTimeout(function () {
  $("#loader").fadeOut("slow");
}, 3000); 

});
