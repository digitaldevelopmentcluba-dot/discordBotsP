const officers = [
    {
        name: "Valkyrie (@h4r1337 qu1nn)",
        role: "President",
        img: "assets/harley.png",
        bio: `Valkyrie is an avid tech-enthusiast with an interest in hacking all the things.\n\nShe is currently a sophomore student at Chattanooga State and remains an active member of the student community, whether it is through being a peer mentor for TigerAccess, hosting HonkSec Radio on The WAWL, or very recently serving in the SGA, she is always finding something to do on-campus outside of her classes.\n\nOutside of Chattanooga State, she is a member of NoogaHackers (formerly DEF CON Group, DC423), hangs out at local punk shows, and sings karaoke in the area. You might find her hacker handle tagged at some dive bar somewhere in the city.`
    },
    {
        name: "Michael (@Breezist)",
        role: "Vice President",
        img: "assets/breezist.png",
        bio: `Hello! I am Michael, I am a Node.js + TypeScript programmer with 10+ years of experience.\n\nI am currently (as of Fall 2026) a sophomore student at Chattanooga State, in a Tennessee Transfer Pathways program in Computer Science. I will be transferring to the University of Tennessee @ Chattanooga in 2027.\n\nI created this website! If you find any bugs or things that should not be there <s>just turn off light mode - bugs love the light!</s> In all seriousness, contact me on Discord @Breezist.`
    },
    {
        name: "@Alto",
        role: "Communications Lead",
        img: "assets/alto.png",
        bio: ""
    },
    {
        name: "Placeholder",
        role: "Secretary",
        img: "assets/anonymous.png",
        bio: ""
    },
    {
        name: "Placeholder",
        role: "Treasurer",
        img: "assets/anonymous.png",
        bio: ""
    },
    {
        name: "Placeholder",
        role: "Events Planner",
        img: "assets/anonymous.png",
        bio: ""
    }
];

function renderOfficers(officers) {
    return officers.map(officer => `
    <div class="officer-card">
      <img src="${officer.img}" alt="${officer.role}">
      <h3>${officer.name}</h3>
      <span>${officer.role}</span>
      <pre>${officer.bio}</pre>
    </div>
  `).join("");
}

document.getElementById("officers").innerHTML = renderOfficers(officers);