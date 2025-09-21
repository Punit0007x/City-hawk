<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Reports - Civic Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { 
            font-family: 'Inter', sans-serif; 
            background-color: #f3f4f6;
            background-image: linear-gradient(to top right, #e0c3fc 0%, #8ec5fc 100%);
            min-height: 100vh;
        }
        .view-container { transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out; }
        .view-hidden { opacity: 0; transform: scale(0.98); pointer-events: none; }
        .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
        .star-rating svg { transition: color 0.2s ease; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .gradient-text { background-image: linear-gradient(to right, #4f46e5, #a259ff); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .btn-gradient { background-image: linear-gradient(to right, #6366f1 0%, #a855f7 51%, #6366f1 100%); background-size: 200% auto; transition: background-position 0.5s; }
        .btn-gradient:hover { background-position: right center; }
        #deleteModal { transition: opacity 0.3s ease; }
        #deleteModal > div { transition: transform 0.3s ease; }
    </style>
</head>
<body class="antialiased text-gray-800">

<header class="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div class="flex justify-between items-center">
        <h1 class="text-xl sm:text-2xl font-bold gradient-text">Citizen Dashboard</h1>
        <a href="dashboard.html" class="hidden sm:inline-flex items-center gap-2 py-2 px-4 text-sm font-semibold rounded-lg text-white shadow-md transition-transform transform hover:-translate-y-px btn-gradient">
            <i class="fa-solid fa-arrow-left"></i>
            Back to Dashboard
        </a>
    </div>
  </div>
</header>

<main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  
  <div id="reportsListView" class="view-container">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">My Submitted Reports</h2>
       <a href="dashboard.html" class="sm:hidden items-center gap-2 py-2 px-3 text-sm font-semibold rounded-lg text-white shadow-md transition-colors btn-gradient">
            <i class="fa-solid fa-arrow-left"></i>
        </a>
    </div>

    <form id="addReportForm" class="bg-white rounded-xl shadow p-4 mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
      <div class="flex-1">
        <label for="reportCategory" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select id="reportCategory" name="category" class="w-full border rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
          <option value="Pothole">Pothole</option>
          <option value="Waste Management">Waste Management</option>
          <option value="Broken Streetlight">Broken Streetlight</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Park Maintenance">Park Maintenance</option>
          <option value="Traffic Signal Issue">Traffic Signal Issue</option>
        </select>
      </div>
      <div class="flex-1">
        <label for="reportDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input type="text" id="reportDescription" name="description" class="w-full border rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" placeholder="Describe the issue..." required />
      </div>
      <button type="submit" class="mt-2 sm:mt-0 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 btn-gradient">
        <i class="fa-solid fa-plus mr-1"></i>Add Report
      </button>
    </form>

    <div id="reportsContainer" class="space-y-4"></div>
    <div id="noReportsMessage" class="hidden text-center bg-white rounded-lg p-12 shadow">
        <i class="fa-solid fa-file-circle-xmark text-5xl gradient-text mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-800">No Reports Found</h3>
        <p class="text-gray-500 mt-2">You haven't submitted any reports yet. <br>When you do, they will appear here.</p>
    </div>
  </div>

  <div id="reportDetailView" class="view-container view-hidden absolute top-20 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Report Details</h2>
      <button id="backToListBtn" class="flex items-center gap-2 py-2 px-4 text-sm font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm transition-colors">
        <i class="fa-solid fa-arrow-left"></i>
        Back to List
      </button>
    </div>
    <div id="reportDetailContainer" class="bg-white p-6 sm:p-8 rounded-2xl shadow-xl"></div>
  </div>

</main>

<div id="deleteModal" class="fixed inset-0 bg-black bg-opacity-60 hidden items-center justify-center z-[100] p-4">
    <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md transform scale-95">
        <div class="text-center">
            <i class="fa-solid fa-triangle-exclamation text-4xl text-red-500"></i>
            <h3 class="text-xl font-bold mt-4 text-gray-800">Confirm Deletion</h3>
            <p class="text-sm text-gray-600 mt-2">Are you sure you want to permanently delete this report? This action cannot be undone.</p>
        </div>
        <div id="modalReportInfo" class="text-sm mt-4 bg-gray-50 p-3 rounded-lg border"></div>
        <div class="mt-6 flex justify-end gap-3">
            <button id="cancelDelete" class="py-2 px-4 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-colors">Cancel</button>
            <button id="confirmDelete" class="py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors">Delete Permanently</button>
        </div>
    </div>
</div>


<script>
document.addEventListener('DOMContentLoaded', () => {
    let reports = [];

    // --- NORMALIZE REPORT SCHEMA --- //
    function normalizeReport(r) {
        // ADD `solvedPhoto` to the schema
        return {
            trackingId: r.trackingId || ('TID-' + Date.now() + '-' + Math.floor(Math.random() * 1000)),
            issueCategory: r.issueCategory || r.category || 'General',
            issueDescription: r.issueDescription || r.description || '',
            latitude: r.latitude || '',
            longitude: r.longitude || '',
            timestamp: r.timestamp || Date.now(),
            status: r.status || 'submitted',
            photos: Array.isArray(r.photos) ? r.photos : [],
            solvedPhoto: r.solvedPhoto || null, // <<< ADDED THIS LINE
            feedback: r.feedback || '',
            rating: r.rating || 0
        };
    }

    // --- DATA INITIALIZATION --- //
    function setupInitialData() {
        const stored = localStorage.getItem('reports');
        try {
            const parsed = stored ? JSON.parse(stored) : [];
            return parsed.map(normalizeReport);
        } catch(e) {
            localStorage.removeItem('reports');
            return [];
        }
    }

    // --- SAVE HELPER --- //
    function saveReports() {
        localStorage.setItem('reports', JSON.stringify(reports.map(normalizeReport)));
    }

    reports = setupInitialData();

    // --- ELEMENT REFERENCES --- //
    const reportsContainer = document.getElementById('reportsContainer');
    const reportDetailContainer = document.getElementById('reportDetailContainer');
    const reportsListView = document.getElementById('reportsListView');
    const reportDetailView = document.getElementById('reportDetailView');
    const backToListBtn = document.getElementById('backToListBtn');
    const noReportsMessage = document.getElementById('noReportsMessage');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const modalReportInfo = document.getElementById('modalReportInfo');
    const addReportForm = document.getElementById('addReportForm');
    const reportCategory = document.getElementById('reportCategory');
    const reportDescription = document.getElementById('reportDescription');

    // --- UTILITY FUNCTIONS --- //
    const escapeHtml = (str) => String(str || '').replace(/[&<>"'`]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'})[s]);
    const isImageFile = (name) => /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(name);

    const statusConfig = {
        submitted: { text: 'Submitted', color: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-900 border border-yellow-200/50', icon: 'fa-solid fa-paper-plane' },
        inprogress: { text: 'In Progress', color: 'bg-gradient-to-r from-cyan-100 to-sky-100 text-cyan-900 border border-cyan-200/50', icon: 'fa-solid fa-person-digging' },
        resolved: { text: 'Resolved', color: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-900 border border-emerald-200/50', icon: 'fa-solid fa-circle-check' }
    };

    // --- VIEW MANAGEMENT --- //
    function switchView(viewToShow) {
        const viewToHide = viewToShow === 'list' ? reportDetailView : reportsListView;
        const targetView = viewToShow === 'list' ? reportsListView : reportDetailView;
        viewToHide.classList.add('view-hidden');
        setTimeout(() => {
            viewToHide.classList.add('hidden');
            targetView.classList.remove('hidden');
            setTimeout(() => {
                targetView.classList.remove('view-hidden');
                window.scrollTo(0, 0);
            }, 20);
        }, 300);
    }

    // --- RENDERING LOGIC --- //
    function renderList() {
        reportsContainer.innerHTML = '';
        if (!reports.length) {
            noReportsMessage.classList.remove('hidden');
            reportsContainer.classList.add('hidden');
            return;
        }
        noReportsMessage.classList.add('hidden');
        reportsContainer.classList.remove('hidden');

        reports.forEach(r => {
            const { text, color, icon } = statusConfig[r.status] || statusConfig.submitted;
            const firstImage = r.photos?.find(p => isImageFile(p.name));
            const cardHTML = `
                <div class="bg-white rounded-xl shadow-md overflow-hidden flex cursor-pointer card-hover transition-all duration-300" data-tid="${r.trackingId}">
                    ${firstImage ? `<img src="${firstImage.dataUrl}" alt="${escapeHtml(firstImage.name)}" class="w-24 h-full sm:w-32 object-cover"/>` : '<div class="w-24 sm:w-32 bg-gray-100 flex items-center justify-center"><i class="fa-solid fa-image text-3xl text-gray-300"></i></div>'}
                    <div class="p-4 sm:p-5 flex-grow">
                        <div class="flex justify-between items-start">
                            <h3 class="text-base sm:text-lg font-bold text-gray-800">${escapeHtml(r.issueCategory)}</h3>
                            <span class="text-xs font-semibold px-3 py-1 rounded-full ${color} flex items-center gap-2">
                                <i class="${icon}"></i>${escapeHtml(text)}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 mt-1 line-clamp-2">${escapeHtml(r.issueDescription)}</p>
                        <div class="text-xs text-gray-500 mt-3 flex justify-between items-center">
                            <p>ID: <span class="font-mono bg-gray-100 px-1.5 py-0.5 rounded">${escapeHtml(r.trackingId)}</span></p>
                            <button class="delete-btn text-gray-400 hover:text-red-600 transition-colors px-2 py-1 rounded" data-tid="${r.trackingId}" aria-label="Delete report">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
            reportsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
        attachListListeners();
    }

    function renderDetail(tid) {
        const report = reports.find(x => x.trackingId === tid);
        if (!report) { switchView('list'); return; }
        reportDetailContainer.dataset.current = tid;
        const { text, color, icon } = statusConfig[report.status] || statusConfig.submitted;
        const images = report.photos?.filter(p => isImageFile(p.name)) || [];

        let photosHTML = '';
        if (images.length > 0) {
            photosHTML = `
                <div class="mt-8">
                    <h4 class="font-semibold text-lg mb-3 text-gray-800">Uploaded Photos</h4>
                    <ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        ${images.map(p => `
                            <li>
                                <img src="${p.dataUrl}" alt="${escapeHtml(p.name)}" class="w-full h-32 object-cover rounded-lg shadow-sm border"/>
                                <p class="text-xs mt-1 text-gray-500 truncate" title="${escapeHtml(p.name)}">${escapeHtml(p.name)}</p>
                            </li>`).join('')}
                    </ul>
                </div>`;
        }
        
        // ========================================================== //
        // ========= START: CODE ADDED TO SHOW SOLVED PHOTO ========= //
        // ========================================================== //
        let solvedPhotoHTML = '';
        if (report.solvedPhoto) {
            solvedPhotoHTML = `
                <div class="mt-8">
                    <h4 class="font-semibold text-lg mb-3 text-gray-800">Resolution Photo</h4>
                    <div class="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <img src="${report.solvedPhoto}" alt="Photo showing the resolved issue" class="w-full h-auto max-w-lg mx-auto rounded-lg shadow-md"/>
                        <p class="text-xs text-center mt-2 text-emerald-800 font-medium">This photo was uploaded by the department as proof of resolution.</p>
                    </div>
                </div>
            `;
        }
        // ======================================================== //
        // ========= END: CODE ADDED TO SHOW SOLVED PHOTO ========= //
        // ======================================================== //

        reportDetailContainer.innerHTML = `
            <div class="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <h3 class="text-3xl font-bold text-gray-900">${escapeHtml(report.issueCategory)}</h3>
                <span class="text-sm font-semibold px-4 py-1.5 rounded-full ${color} flex items-center gap-2 self-start">${escapeHtml(text)}</span>
            </div>
            <p class="text-gray-600 mt-4 text-base whitespace-pre-wrap">${escapeHtml(report.issueDescription)}</p>
            <div class="mt-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border space-y-2">
                <p><strong><i class="fa-solid fa-hashtag w-5"></i> Tracking ID:</strong> <span class="font-mono bg-gray-200 px-1.5 py-0.5 rounded">${escapeHtml(report.trackingId)}</span></p>
                <p><strong><i class="fa-solid fa-location-dot w-5"></i> Location:</strong> Lat: ${escapeHtml(report.latitude)}, Lon: ${escapeHtml(report.longitude)}</p>
                <p><strong><i class="fa-solid fa-calendar-days w-5"></i> Submitted On:</strong> ${new Date(report.timestamp).toLocaleString()}</p>
            </div>
            
            ${photosHTML}
            
            ${solvedPhotoHTML}

            <div class="mt-8 border-t pt-6">
                <h4 class="font-semibold text-lg mb-4 text-gray-800">Your Feedback & Rating</h4>
                <textarea id="feedbackInput" rows="4" class="w-full border rounded-lg p-3 text-gray-800 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" placeholder="Share your experience with the resolution...">${escapeHtml(report.feedback)}</textarea>
                <div class="mt-4 flex items-center space-x-3">
                    <label class="font-semibold text-gray-800">Rating:</label>
                    <div id="starRating" class="flex space-x-1 star-rating">
                        ${[1, 2, 3, 4, 5].map(s => `
                            <button type="button" class="text-gray-300 hover:text-yellow-400" data-star="${s}" aria-label="Rate ${s} stars">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            </button>`).join('')}
                    </div>
                </div>
                <button id="saveFeedbackBtn" class="mt-6 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 btn-gradient">Save Feedback</button>
            </div>`;
        attachDetailListeners(report);
    }

    // --- MODAL MANAGEMENT --- //
    function showDeleteModal(tid) {
        const report = reports.find(r => r.trackingId === tid);
        if (!report) return;
        modalReportInfo.innerHTML = `
            <p><strong>ID:</strong><span class="font-mono ml-2 bg-gray-200 px-1.5 py-0.5 rounded">${escapeHtml(report.trackingId)}</span></p>
            <p class="mt-1"><strong>Category:</strong><span class="ml-2">${escapeHtml(report.issueCategory)}</span></p>`;
        deleteModal.classList.remove('hidden');
        deleteModal.classList.add('flex');
        setTimeout(() => {
            deleteModal.classList.remove('opacity-0');
            deleteModal.querySelector('div').classList.remove('scale-95');
        }, 10);
        const confirmHandler = () => {
            reports = reports.filter(r => r.trackingId !== tid);
            saveReports();
            renderList();
            hideDeleteModal();
            if(reportDetailView.dataset.current === tid) {
                switchView('list');
            }
            confirmDeleteBtn.removeEventListener('click', confirmHandler);
        };
        confirmDeleteBtn.addEventListener('click', confirmHandler);
    }

    function hideDeleteModal() {
        deleteModal.classList.add('opacity-0');
        deleteModal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            deleteModal.classList.add('hidden');
            deleteModal.classList.remove('flex');
            deleteModal.classList.remove('opacity-0');
        }, 300);
    }

    function attachListListeners() {
        reportsContainer.querySelectorAll('[data-tid]').forEach(card => {
            card.addEventListener('click', e => {
                if(e.target.closest('.delete-btn')) return;
                renderDetail(card.dataset.tid);
                switchView('detail');
            });
        });
        reportsContainer.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                showDeleteModal(btn.dataset.tid);
            });
        });
    }

    function attachDetailListeners(report) {
        const starBtns = document.querySelectorAll('#starRating button');
        starBtns.forEach((btn, idx) => {
            if(idx < report.rating) btn.classList.add('text-yellow-400');
            btn.addEventListener('click', () => {
                report.rating = parseInt(btn.dataset.star);
                starBtns.forEach((b, i) => {
                    if(i < report.rating) b.classList.add('text-yellow-400');
                    else b.classList.remove('text-yellow-400');
                });
            });
        });

        const saveFeedbackBtn = document.getElementById('saveFeedbackBtn');
        saveFeedbackBtn.addEventListener('click', () => {
            report.feedback = document.getElementById('feedbackInput').value.trim();
            const idx = reports.findIndex(r => r.trackingId === report.trackingId);
            if(idx !== -1) {
                reports[idx] = report;
                saveReports();
                alert('Feedback & rating saved successfully!');
            }
        });
    }

    // --- ADD REPORT HANDLER --- //
    if (addReportForm) {
      addReportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const category = reportCategory.value;
        const description = reportDescription.value.trim();
        if (!category || !description) return;
        // Dummy lat/lon for now
        const lat = '0.0';
        const lon = '0.0';
        // Create normalized report
        const newReport = normalizeReport({
          issueCategory: category,
          issueDescription: description,
          latitude: lat,
          longitude: lon,
          photos: [],
          status: 'submitted',
          timestamp: Date.now()
        });
        reports.unshift(newReport);
        saveReports();
        renderList();
        addReportForm.reset();
      });
    }

    backToListBtn.addEventListener('click', () => switchView('list'));
    cancelDeleteBtn.addEventListener('click', hideDeleteModal);

    // --- INITIAL RENDER --- //
    renderList();
});
</script>

</body>
</html>
