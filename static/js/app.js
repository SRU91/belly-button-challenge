const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function init() {
    const dropdownMenu = d3.select("#selDataset");

    // Reads in samples.json data from url
    d3.json(url).then(data => {
        const names = data.names;
        dropdownMenu.selectAll("option")
            .data(names)
            .enter()
            .append("option")
            .text(id => id)
            .property("value", id => id);

        // Initializes with the first sample
        const sampleOne = names[0];
        buildMetadata(sampleOne);
        buildBarChart(sampleOne);
        buildBubbleChart(sampleOne);
    });
}

// Reads metadata for selected sample and updates sample-metadata for display
function buildMetadata(sample) {
    d3.json(url).then(data => {
        const metadata = data.metadata.find(subject => subject.id == sample);
        const metadataPanel = d3.select("#sample-metadata").html("");

        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("h5").text(`${key}: ${value}`);
        });
    });
}

// Creates bar chart & displays top 10 OTUs for selected sample
function buildBarChart(sample) {
    d3.json(url).then(data => {
        const sampleData = data.samples.find(subject => subject.id == sample);
        const otuIds = sampleData.otu_ids.slice(0, 10).reverse();
        const otuLabels = sampleData.otu_labels.slice(0, 10).reverse();
        const sampleValues = sampleData.sample_values.slice(0, 10).reverse();

        const trace = {
            x: sampleValues,
            y: otuIds.map(id => `OTU ${id}`),
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };

        const layout = {
            title: "Top 10 OTUs Present"
        };

        Plotly.newPlot("bar", [trace], layout);
    });
}

// Creates the bubble chart from the selected sample
function buildBubbleChart(sample) {
    d3.json(url).then(data => {
        const sampleData = data.samples.find(subject => subject.id == sample);

        const trace = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Earth"
            }
        };

        const layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
        };

        Plotly.newPlot("bubble", [trace], layout);
    });
}

// Update the dashboard when a new sample is selected
function optionChanged(value) {
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
}

init();
