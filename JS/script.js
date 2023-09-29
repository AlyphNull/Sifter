function predictPopulation() {
    // Get selected province and year from the HTML form
    var selectedProvince = document.getElementById('area').value;
    var selectedYear = document.getElementById('year').value;

    // Check if the selected year is within the valid range (2015-2030)
    if (selectedYear >= 2015 && selectedYear <= 2030) {
        // Read data from the Excel file
        var fileUrl = 'rwanda.pop.xlsx'; // Path to the Excel file in your repository
        fetch(fileUrl)
            .then(response => response.arrayBuffer())
            .then(data => {
                var workbook = XLSX.read(data, { type: 'array' });
                var population = processWorkbook(workbook, selectedProvince, selectedYear);
                displayPopulation(population);
            })
            .catch(error => {
                console.error('Error reading the Excel file:', error);
                displayPopulation('Error reading the data. Please try again.');
            });
    } else {
        displayPopulation('Selected year is out of range (2015-2030).');
    }
}

function processWorkbook(workbook, province, year) {
    var firstSheet = workbook.SheetNames[0];
    var data = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);

    // Find the row for the selected province
    var selectedRow = data.find(row => row['Province'] === province);

    if (selectedRow) {
        // Get the corresponding population for the selected year
        var columnKey = 'BTOTL_' + year;
        var population = selectedRow[columnKey];

        if (population) {
            return population;
        } else {
            return 'Population data not available for the selected year.';
        }
    } else {
        return 'Province not found in the data.';
    }
}

function displayPopulation(population) {
    // Display the calculated population or error message in the HTML
    var predictionOutput = document.getElementById('prediction');
    predictionOutput.textContent = population;
}
