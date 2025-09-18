<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Reports - Civic Dashboard</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5;
        }
        #myReportsContainer::-webkit-scrollbar {
            width: 8px;
        }
        #myReportsContainer::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        #myReportsContainer::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
        }
        #myReportsContainer::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
        }
        /* Styles for the status timeline */
        .timeline {
            position: relative;
            padding-left: 30px;
            border-left: 2px solid #e2e8f0;
        }
        .timeline-item {
            position: relative;
            margin-bottom: 20px;
        }
        .timeline-item:last-child {
            margin-bottom: 0;
        }
        .timeline-dot {
            position: absolute;
            left: -39.5px; /* Aligns dot perfectly on the line */
            top: 4px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 3px solid #f0f2f5; /* Match body background */
        }
        .timeline-item.status-pending .timeline-dot { background-color: #f59e0b; } /* Amber-500 */
        .timeline-item.status-inprogress .timeline-dot { background-color: #3b82f6; } /* Blue-500 */
        .timeline-item.status-resolved .timeline-dot { background-color: #22c55e; } /* Green-500 */
    </style>
</head>
<body class="antialiased text-gray-800">

    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <h1 class="text-2xl font-bold text-gray-900">Citizen Dashboard</h1>
        </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-bold text-gray-900">My Submitted Reports</h2>
            <a href="dashboard.html" class="py-2 px-4 text-sm font-bold rounded-lg transition-colors duration-200 bg-orange-500 hover:bg-orange-600 text-white">&larr; Back to Dashboard</a>
        </div>

        <div id="myReportsContainer" class="space-y-6 bg-white p-6 rounded-xl shadow-lg max-h-[75vh] overflow-y-auto">
            <p id="noReportsMessage" class="hidden text-center text-gray-500 py-12">
                You have not submitted any reports yet.
            </p>
            
            </div>
    </main>

    <script>
    document.addEventListener('DOMContentLoaded', () => {
        // --- MOCK DATA ---
        // In a real application, you would fetch this data from localStorage, a server, etc.
        const userSubmittedReports = [
            {
                category: 'Potholes',
                description: '*** AI-Generated Issue Analysis ***\n\nISSUE TYPE:\nPotholes\n\nSEVERITY ASSESSMENT:\nHigh\n\nDETAILED DESCRIPTION (from image analysis):\nImage analysis indicates a cluster of potholes. The largest appears to be approximately 2 feet in diameter and 4-6 inches deep. Road surface is significantly degraded.\n\nPOTENTIAL IMPACT:\nPoses a severe risk to two-wheeler and four-wheeler vehicles, potentially causing tire or suspension damage and accidents.\n\nSUGGESTED ACTION:\nImmediate road surface repair and filling of potholes is recommended.',
                trackingId: 'RPT-9A4B1C8D',
                status: 'resolved',
                lat: '12.9716',
                lon: '77.5946',
                createdAt: new Date('2023-10-26T10:00:00Z'),
                timeline: [
                    { status: 'pending', text: 'Report Submitted', date: new Date('2023-10-26T10:00:00Z') },
                    { status: 'inprogress', text: 'Issue acknowledged. A team has been assigned.', date: new Date('2023-10-26T14:30:00Z') },
                    { status: 'resolved', text: 'The potholes have been filled and the road has been repaired.', date: new Date('2023-10-27T16:00:00Z') }
                ]
            },
            {
                category: 'Garbage Overflow',
                description: 'The community dustbin near the park has been overflowing for three days. It\'s causing a foul smell and attracting stray animals.',
                trackingId: 'RPT-F2E7G6H5',
                status: 'inprogress',
                lat: '12.9611',
                lon: '77.6387',
                createdAt: new Date('2023-10-27T11:20:00Z'),
                timeline: [
                    { status: 'pending', text: 'Report Submitted', date: new Date('2023-10-27T11:20:00Z') },
                    { status: 'inprogress', text: 'Sanitation crew has been notified and is en route.', date: new Date('2023-10-28T09:00:00Z') }
                ]
            },
            {
                category: 'Streetlights',
                description: 'The streetlight on the corner of 5th Main and 12th Cross is not working.',
                trackingId: 'RPT-K4J9M2N1',
                status: 'pending',
                lat: '12.9784',
                lon: '77.5995',
                createdAt: new Date(),
                timeline: [
                    { status: 'pending', text: 'Report Submitted', date: new Date() }
                ]
            }
        ];

        const myReportsContainer = document.getElementById('myReportsContainer');
        const noReportsMessage = document.getElementById('noReportsMessage');

        function displayMyReports() {
            myReportsContainer.innerHTML = ''; // Clear previous content
            
            if (userSubmittedReports.length === 0) {
                noReportsMessage.classList.remove('hidden');
                return;
            }
            
            noReportsMessage.classList.add('hidden');

            userSubmittedReports.forEach(report => {
                const timelineHTML = report.timeline.map(item => `
                    <div class="timeline-item status-${item.status}">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <p class="font-semibold text-sm">${item.text}</p>
                            <p class="text-xs text-gray-500">${item.date.toLocaleString()}</p>
                        </div>
                    </div>
                `).join('');

                const cardHTML = `
                    <div class="p-5 border rounded-xl bg-gray-50/50">
                        <div class="flex justify-between items-start">
                            <h3 class="text-lg font-bold text-gray-800">${report.category}</h3>
                            <span class="text-xs font-semibold px-2 py-1 rounded-full 
                                ${report.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                                  report.status === 'inprogress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}">
                                ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 mt-2 whitespace-pre-wrap">${report.description || 'No description provided.'}</p>
                        <div class="text-xs text-gray-500 mt-3">
                            <p>Tracking ID: <span class="font-mono bg-gray-200 px-1 rounded">${report.trackingId}</span></p>
                            <p>Location: Lat: ${report.lat}, Lon: ${report.lon}</p>
                        </div>
                        <div class="mt-4">
                            <h4 class="font-semibold text-sm mb-2">Status History</h4>
                            <div class="timeline">${timelineHTML}</div>
                        </div>
                    </div>
                `;
                myReportsContainer.innerHTML += cardHTML;
            });
        }

        // Initial render of the reports
        displayMyReports();
    });
    </script>

</body>
</html>