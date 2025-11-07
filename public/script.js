document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const urlsInput = document.getElementById('urls-input');
    const generateBtn = document.getElementById('generate-btn');
    const loader = document.getElementById('loader');
    const resultsContainer = document.getElementById('results-container');
    const downloadContainer = document.getElementById('download-container');
    const downloadTxtBtn = document.getElementById('download-txt');
    const downloadDocxBtn = document.getElementById('download-docx');
    const downloadXlsxBtn = document.getElementById('download-xlsx');

    // --- State Variable ---
    // This will store the successful results for downloading
    let successfulResults = [];

    // --- Event Listeners ---
    generateBtn.addEventListener('click', handleGenerateClick);
    downloadTxtBtn.addEventListener('click', () => downloadAsTxt());
    downloadDocxBtn.addEventListener('click', () => downloadAsDocx());
    downloadXlsxBtn.addEventListener('click', () => downloadAsXlsx());


    // --- Main Function ---
    async function handleGenerateClick() {
        const urlsText = urlsInput.value.trim();
        if (!urlsText) {
            alert('Please paste some URLs.');
            return;
        }
        const urls = urlsText.split(/[\n, ]+/).filter(url => url.length > 0);

        // --- UI Reset and Preparation ---
        uiStartLoading();

        try {
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls }),
            });

            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

            const responseData = await response.json();
            displayResults(responseData.data);
            
            // Show download buttons if there are any successful results
            if (successfulResults.length > 0) {
                downloadContainer.style.display = 'block';
            }

        } catch (error) {
            resultsContainer.innerHTML = `<div class="result-item error"><strong>Error:</strong> Could not connect to the server. (${error.message})</div>`;
        } finally {
            uiStopLoading();
        }
    }
    
    // --- UI Helper Functions ---
    function uiStartLoading() {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        loader.style.display = 'block';
        resultsContainer.innerHTML = '';
        downloadContainer.style.display = 'none';
        successfulResults = []; // Clear previous results
    }

    function uiStopLoading() {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate';
        loader.style.display = 'none';
    }

    function displayResults(results) {
        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '<p>No results to display.</p>';
            return;
        }

        results.forEach(item => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('result-item');

            if (item.status === 'success') {
                resultDiv.classList.add('success');
                resultDiv.innerHTML = `<strong>${item.url}</strong>${item.result}`;
                // Add to our download list
                successfulResults.push(item);
            } else {
                resultDiv.classList.add('error');
                resultDiv.innerHTML = `<strong>${item.url}</strong>Failed to scrape: ${item.reason}`;
            }
            resultsContainer.appendChild(resultDiv);
        });
    }

    // --- Download Functions ---
    // These functions create a file in the browser and trigger a download.
    // We need to dynamically import the libraries for docx and xlsx.
    
    function downloadAsTxt() {
        const textContent = successfulResults.map(item => item.result).join('\n\n');
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        triggerDownload(blob, 'meta_results.txt');
    }

    async function downloadAsDocx() {
    // We must now also import ExternalHyperlink
    const { Document, Packer, Paragraph, TextRun, ExternalHyperlink } = await import('https://cdn.skypack.dev/docx');
    
    // We will build an array of paragraphs. For each result, we'll add 3 paragraphs:
    // 1. The URL (as a hyperlink)
    // 2. The 'Title; Description' text
    // 3. An empty line for spacing
    const paragraphs = successfulResults.flatMap(item => [
        new Paragraph({
            children: [
                new ExternalHyperlink({
                    children: [
                        new TextRun({
                            text: item.url,
                            style: "Hyperlink", // This tells Word to use its default blue, underlined style
                        }),
                    ],
                    link: item.url, // This makes it a clickable link
                }),
            ],
        }),
        new Paragraph({
            children: [
                new TextRun({ 
                    text: item.result,
                    size: 22 // 11pt font size, a common default
                }),
            ],
        }),
        new Paragraph({ text: "" }) // Creates a blank line for spacing between entries
    ]);

    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs,
        }],
    });

    const blob = await Packer.toBlob(doc);
    triggerDownload(blob, 'meta_results.docx');
}

    async function downloadAsXlsx() {
        const { utils, writeFile } = await import('https://cdn.skypack.dev/xlsx');
        
        // Prepare data in Title | Description format for two columns
        const dataForSheet = successfulResults.map(item => {
            const parts = item.result.split(';');
            const title = parts[0] ? parts[0].trim() : '';
            const description = parts.slice(1).join(';').trim() || '';
            return { Title: title, Description: description };
        });

        const worksheet = utils.json_to_sheet(dataForSheet);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Meta Results');
        
        // This library has its own download function
        writeFile(workbook, 'meta_results.xlsx');
    }

    function triggerDownload(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
});