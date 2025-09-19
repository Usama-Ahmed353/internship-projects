const mockNotifications = [
  { id: 1, text: 'Payment of $1,200 received for Project Alpha', time: '2h ago' },
  { id: 2, text: 'New message from client: Design tweaks', time: '5h ago' },
  { id: 3, text: 'Task "Landing page" marked complete', time: '1d ago' }
];

const mockProjects = [
  { id: 1, name: 'Project Alpha', client: 'Acme Co', status: 'In Progress', deadline: '2025-10-05', earnings: 1200 },
  { id: 2, name: 'Brand Refresh', client: 'Luma Ltd', status: 'Pending', deadline: '2025-09-30', earnings: 800 },
  { id: 3, name: 'Mobile App', client: 'Nova Inc', status: 'Completed', deadline: '2025-08-20', earnings: 3500 }
];

const mockStats = {
  totalProjects: mockProjects.length,
  totalEarnings: mockProjects.reduce((s, p) => s + p.earnings, 0),
  tasksDue: 4
};

document.addEventListener('DOMContentLoaded', () => {
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const notifList = document.getElementById('notifList');
  const notifCount = document.getElementById('notifCount');

  if (notifBtn && notifDropdown && notifList && notifCount) {
    notifCount.textContent = String(mockNotifications.length);
    notifList.innerHTML = '';
    mockNotifications.slice(0, 3).forEach(n => {
      const li = document.createElement('li');
      li.textContent = `${n.text} · ${n.time}`;
      notifList.appendChild(li);
    });
    notifBtn.addEventListener('click', e => {
      e.stopPropagation();
      notifDropdown.style.display = notifDropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', e => {
      if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
        notifDropdown.style.display = 'none';
      }
    });
  }

  const routes = {
    '/overview': renderOverview,
    '/projects': renderProjects,
    '/profile': renderProfile
  };

  const view = document.getElementById('view');

  function mount() {
    if (view) view.innerHTML = '';
  }

  function renderOverview() {
    if (!view) return;
    mount();
    const cards = document.createElement('div');
    cards.className = 'grid cards';
    cards.innerHTML = `
      <div class="card"><h3>Total Projects</h3><p>${mockStats.totalProjects}</p></div>
      <div class="card"><h3>Total Earnings</h3><p>$${mockStats.totalEarnings}</p></div>
      <div class="card"><h3>Tasks Due</h3><p>${mockStats.tasksDue}</p></div>
    `;
    const row = document.createElement('div');
    row.className = 'row';
    const activity = document.createElement('div');
    activity.className = 'activity';
    activity.style.flex = '1';
    activity.innerHTML = '<h3 style="margin:0 0 10px 0">Recent Activity</h3>';
    mockNotifications.forEach(n => {
      const p = document.createElement('div');
      p.style.padding = '8px 0';
      p.style.borderTop = '1px solid #f2f4f6';
      p.textContent = `${n.text} · ${n.time}`;
      activity.appendChild(p);
    });
    const chartCard = document.createElement('div');
    chartCard.className = 'card';
    chartCard.style.flex = '1';
    chartCard.innerHTML = '<h3 style="margin:0 0 10px 0">Monthly Earnings</h3><canvas id="earningsChart"></canvas>';
    row.appendChild(activity);
    row.appendChild(chartCard);
    view.appendChild(cards);
    view.appendChild(row);
    const canvas = document.getElementById('earningsChart');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (window.Chart && ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [{ label: 'Earnings', data: [500, 1200, 900, 1800, 700, 1400, 1200] }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
      }
    }
  }

  function renderProjects() {
    if (!view) return;
    mount();
    const tableWrap = document.createElement('div');
    tableWrap.className = 'table';
    let rows = '<table><thead><tr><th>Project</th><th>Client</th><th>Status</th><th>Deadline</th><th>Earnings</th></tr></thead><tbody>';
    mockProjects.forEach(p => {
      let cls = 'status yellow';
      if (p.status === 'Completed') cls = 'status green';
      if (p.status === 'Pending') cls = 'status red';
      rows += `<tr><td>${p.name}</td><td>${p.client}</td><td><span class="${cls}">${p.status}</span></td><td>${p.deadline}</td><td>$${p.earnings}</td></tr>`;
    });
    rows += '</tbody></table>';
    tableWrap.innerHTML = '<h3>Projects</h3>' + rows;
    view.appendChild(tableWrap);
  }

  function renderProfile() {
    if (!view) return;
    mount();
    const form = document.createElement('div');
    form.className = 'form';
    form.innerHTML = `
      <h3>Profile Settings</h3>
      <label>Name</label>
      <input id="name" value="Usman Hafeez">
      <label>Email</label>
      <input id="email" value="usman@example.com">
      <label>Password</label>
      <input id="password" type="password" placeholder="••••••••">
      <div style="margin-top:12px">
        <button id="saveBtn">Save</button>
      </div>
    `;
    view.appendChild(form);
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        saveBtn.textContent = 'Saved';
        setTimeout(() => {
          saveBtn.textContent = 'Save';
        }, 1200);
      });
    }
  }

  function router() {
    const hash = location.hash || '#/overview';
    const route = hash.startsWith('#') ? hash.slice(1) : hash;
    document.querySelectorAll('[data-route]').forEach(a => {
      const href = a.getAttribute('href') || '';
      a.classList.toggle('active', href === '#' + route);
    });
    const handler = routes[route];
    if (typeof handler === 'function') handler();
    else renderOverview();
  }

  window.addEventListener('hashchange', router);
  document.querySelectorAll('[data-route]').forEach(a => a.addEventListener('click', () => {}));
  router();
});
