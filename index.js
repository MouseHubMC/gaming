const express = require('express');
const fs = require('fs');
const path = require('path');
const ip = require('ip');

(function() {
  const app = express();
  const port = 3000;
  const privateIP = ip.address();
  const directoryPath = path.join(__dirname, 'assets');

  app.get('/', (req, res) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).send('dir is null' + err);
      }

      let fileLinks = files.map(file => `
        <li>
          <a href="/files/${file}" target="_blank">${file}</a>
        </li>
      `).join('');

      let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>uSchool | Unblocked games</title>
  <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      color: #333;
      margin: 0;
      padding: 0;
      position: relative;
    }
    body.dark-mode {
      background-color: #121212;
      color: #ffffff;
    }
    #dark-mode-toggle, #settings-toggle {
      position: fixed;
      top: 10px;
      background-color: transparent;
      color: #000000;
      border: none;
      cursor: pointer;
      font-size: 24px;
    }
    #dark-mode-toggle {
      right: 10px;
    }
    #settings-toggle {
      right: 50px;
    }
    body.dark-mode #dark-mode-toggle, body.dark-mode #settings-toggle {
      color: #ffffff;
    }
    .content {
      margin: 20px;
      position: relative;
      z-index: 1;
    }
    #search {
      width: 200px;
      padding: 10px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
      display: block;
    }
    #file-list {
      list-style-type: none;
      padding: 0;
    }
    #file-list li {
      margin: 5px 0;
    }
    #file-list a {
      text-decoration: none;
      color: #007bff;
    }
    body.dark-mode #file-list a {
      color: #66ccff;
    }
    #particles-js {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    #settings-menu {
      display: none;
      position: fixed;
      top: 50px;
      right: 10px;
      background: #ffffff;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      z-index: 1000;
    }
    #settings-menu.show {
      display: block;
    }
    body.dark-mode #settings-menu {
      background: #1e1e1e;
      border-color: #666;
    }
  </style>
</head>
<body>
  <div id="particles-js"></div>
  <div class="content">
    <button id="dark-mode-toggle">🌙</button>
    <button id="settings-toggle">⚙️</button>
    <div id="settings-menu">
      <div>
        <label for="tab-cloak-input">Tab Cloak:</label>
        <input type="text" id="tab-cloak-input" placeholder="Enter new title">
      </div>
    </div>
    <input type="text" id="search" placeholder="Search files...">
    <ul id="file-list">
      ${fileLinks}
    </ul>
  </div>
  <script>
    const fileList = document.getElementById('file-list');
    const searchInput = document.getElementById('search');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsMenu = document.getElementById('settings-menu');
    const tabCloakInput = document.getElementById('tab-cloak-input');

    function filterFiles() {
      const searchQuery = searchInput.value.toLowerCase();
      const fileItems = Array.from(fileList.getElementsByTagName('li'));

      fileItems.forEach(fileItem => {
        const fileName = fileItem.querySelector('a').textContent.toLowerCase();
        if (fileName.includes(searchQuery)) {
          fileItem.style.display = '';
        } else {
          fileItem.style.display = 'none';
        }
      });
    }

    function toggleDarkMode() {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '☀️';
        particlesJS('particles-js', darkParticlesConfig);
      } else {
        darkModeToggle.textContent = '🌙';
        particlesJS('particles-js', lightParticlesConfig);
      }
    }

    function toggleSettingsMenu() {
      if (settingsMenu.classList.contains('show')) {
        settingsMenu.classList.remove('show');
      } else {
        settingsMenu.classList.add('show');
      }
    }

    function updateTitle() {
      document.title = tabCloakInput.value;
    }

    searchInput.addEventListener('input', filterFiles);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    settingsToggle.addEventListener('click', toggleSettingsMenu);
    tabCloakInput.addEventListener('input', updateTitle);

    const lightParticlesConfig = {
      particles: {
        number: { value: 50 },
        color: { value: "#000000" },
        shape: { type: "circle" },
        size: { value: 3 },
        line_linked: { color: "#000000" }
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: "repulse" }
        }
      }
    };

    const darkParticlesConfig = {
      particles: {
        number: { value: 50 },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        size: { value: 3 },
        line_linked: { color: "#ffffff" }
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: "repulse" }
        }
      }
    };

    particlesJS('particles-js', lightParticlesConfig);
  </script>
</body>
</html>
`;

      res.send(html);
    });
  });

  app.use('/files', express.static(directoryPath));

  app.listen(port, () => {
    console.log(`server running at http://${privateIP}:${port}/`);
  });
})();