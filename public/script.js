async function askDobby() {
  const question = document.getElementById("question").value;
  
  // جلب موقع المستخدم
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, lat, lon })
    });

    const data = await res.json();

    document.getElementById("response").innerHTML = `<p><b>دوبي:</b> ${data.dobby}</p>`;

    if (data.places.length > 0) {
      document.getElementById("places").innerHTML = data.places.map(p => `
        <div class="place">
          <h3>${p.name}</h3>
          <p>📍 ${p.address}</p>
          <p>📏 ${p.distance} متر</p>
          <p>🏷️ ${p.categories}</p>
        </div>
      `).join("");
    } else {
      document.getElementById("places").innerHTML = "";
    }

  }, (err) => {
    alert("محتاج إذن للوصول لموقعك");
  });
}
