document.addEventListener("DOMContentLoaded", () => {
  const animatedTexts = document.querySelectorAll(".animated-text");
  const colors = ["red", "blue", "green", "orange", "purple"];
  let colorIndex = 0;

  setInterval(() => {
    animatedTexts.forEach((el) => {
      el.style.color = colors[colorIndex];
    });
    colorIndex = (colorIndex + 1) % colors.length;
  }, 1000);
});

window.addEventListener("load", () => {
  const popup = document.getElementById("tourPopup");
  if (popup) popup.style.display = "flex";
});

function closePopup() {
  const popup = document.getElementById("tourPopup");
  if (popup) popup.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const typingElements = document.querySelectorAll("[data-typing]");

  typingElements.forEach((el) => {
    const text = el.getAttribute("data-typing");
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50); // typing speed (lower = faster)
      }
    }

    typeWriter();
  });
});

// ================= FIREBASE SETUP ================= //
// Import via <script> in HTML, not "import" in JS file
// Add this to your portfolio.html <head> before your index.js:
// <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"></script>

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyASNPhcR48elTbx-Blz5MukaRcbK4qw1HY",
  authDomain: "portfolio-b083b.firebaseapp.com",
  projectId: "portfolio-b083b",
  storageBucket: "portfolio-b083b.appspot.com",
  messagingSenderId: "687287141846",
  appId: "1:687287141846:web:e7dd275b7f19b0cb031077",
  measurementId: "G-KSJBHX5KYE"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ================= POST FUNCTIONALITY ================= //
const postForm = document.getElementById("postForm");
const postList = document.getElementById("postList");

// Add a new post
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = document.getElementById("postContent").value;

  if (content.trim() === "") return;

  await db.collection("posts").add({
    text: content,
    likes: 0,
    comments: [],
    createdAt: new Date()
  });

  document.getElementById("postContent").value = ""; // reset input
});

// Fetch and display posts
function loadPosts() {
  db.collection("posts").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
    postList.innerHTML = ""; // clear first

    snapshot.forEach((doc) => {
      const post = doc.data();
      const postId = doc.id;

      const postDiv = document.createElement("div");
      postDiv.classList.add("post");

      postDiv.innerHTML = `
        <p>${post.text}</p>
        <small>Likes: ${post.likes}</small>
        <button onclick="likePost('${postId}', ${post.likes})">❤️ Like</button>
        <div>
          <input type="text" id="comment-${postId}" placeholder="Write a comment">
          <button onclick="addComment('${postId}')">💬 Comment</button>
        </div>
        <div class="comments">
          ${post.comments.map(c => `<p>💭 ${c}</p>`).join("")}
        </div>
      `;

      postList.appendChild(postDiv);
    });
  });
}

// Like a post
async function likePost(postId, currentLikes) {
  await db.collection("posts").doc(postId).update({
    likes: currentLikes + 1
  });
}

// Add a comment
async function addComment(postId) {
  const commentInput = document.getElementById(`comment-${postId}`);
  const comment = commentInput.value.trim();
  if (comment === "") return;

  const postRef = db.collection("posts").doc(postId);
  const postDoc = await postRef.get();
  const postData = postDoc.data();

  const updatedComments = [...postData.comments, comment];

  await postRef.update({
    comments: updatedComments
  });

  commentInput.value = ""; // clear input
}

// Load posts on page ready
window.onload = loadPosts;

// ✅ Your Firebase config (from your project settings)
const firebaseConfig = {
  apiKey: "AIzaSyASNPhcR48elTbx-Blz5MukaRcbK4qw1HY",
  authDomain: "portfolio-b083b.firebaseapp.com",
  projectId: "portfolio-b083b",
  storageBucket: "portfolio-b083b.firebasestorage.app",
  messagingSenderId: "687287141846",
  appId: "1:687287141846:web:e7dd275b7f19b0cb031077",
  measurementId: "G-KSJBHX5KYE"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Handle contact form submission
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  try {
    // Save message to Firestore
    await db.collection("messages").add({
      name: name,
      email: email,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    document.getElementById("statusMessage").innerText = "✅ Message sent successfully!";
    document.getElementById("contactForm").reset();

  } catch (error) {
    console.error("Error adding document: ", error);
    document.getElementById("statusMessage").innerText = "❌ Failed to send message. Try again.";
  }
});