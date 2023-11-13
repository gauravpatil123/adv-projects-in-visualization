//Chart global variables
const margin = 80;
const width = 1300;
const height = 500;
var tooltip_text_color = "#eeeeee";
var axislabel_color = "#333333";

//loading data
d3.csv("../data/global temperatutes/annual_temp_anomaly_filtered.csv").then(dataset => {
    dataset.forEach(d => {
        d.year = +d["Time"];
        d.anomaly = +d["Anomaly (deg C)"];
    });

    const xScale = d3.scaleBand()
                    .domain(dataset.map(d => d.year))
                    .range([margin, width - margin])
                    .paddingInner(0.2)
                    .paddingOuter(0.2);

    const bottomAxis = d3.axisBottom().scale(xScale);

    // console.log(d3.max(dataset, d => d.anomaly))
    // console.log(d3.min(dataset, d => d.anomaly))

    const maxY_temp_anomaly = 1.0;
    const minY_temp_anomaly = -1.0;

    const yScale_temp_anomaly = d3.scaleLinear()
                                        .domain([minY_temp_anomaly, maxY_temp_anomaly])
                                        .range([height - margin, margin]);

    const yScale_temp_anomaly_plus = d3.scaleLinear()
                                            .domain([0, maxY_temp_anomaly])
                                            .range([(height / 2), margin]);

    const yScale_temp_anomaly_minus = d3.scaleLinear()
                                            .domain([minY_temp_anomaly, 0])
                                            .range([height - margin, (height / 2)]);

    const leftAxis_temp_anomaly = d3.axisLeft().scale(yScale_temp_anomaly);

    const temp_anomaly_color_scale_plus = d3.scaleLinear()
                                                .domain([0, maxY_temp_anomaly])
                                                .range(["#F1C40F", "#FD0000"]);                    

    const temp_anomaly_color_scale_minus = d3.scaleLinear()
                                                .domain([minY_temp_anomaly, 0])
                                                .range(["#1B4F72", "#AED6F1"]);
    
    const svg_temp_anomaly = d3.select("#svg1");

    svg_temp_anomaly.selectAll("rect")
                            .data(dataset)
                            .enter()
                            .append("rect")
                            .attr("x", d => xScale(d.year))
                            .attr("y", d => d.anomaly >= 0 ? yScale_temp_anomaly_plus(d.anomaly) : height / 2)
                            .attr("width", xScale.bandwidth())
                            .attr("height", d => d.anomaly >= 0 ? ((height / 2) - yScale_temp_anomaly_plus(d.anomaly)) : (yScale_temp_anomaly_minus(d.anomaly) - (height / 2)))
                            .attr("fill", d => d.anomaly >=0 ? temp_anomaly_color_scale_plus(d.anomaly) : temp_anomaly_color_scale_minus(d.anomaly));
    
    svg_temp_anomaly.append("g")
                            .attr("class", "axis")
                            .attr("id", "bot")
                            .attr("transform", "translate(0," + (height - margin) + ")")
                            .call(bottomAxis);

    svg_temp_anomaly.append("g")
                            .attr("class", "axis")
                            .attr("id", "left")
                            .attr("transform", "translate(" + margin + ",0)")
                            .call(leftAxis_temp_anomaly);

    svg_temp_anomaly.append("text")
                    .attr("x", 420)
                    .attr("y", 60)
                    .attr("class", "viz-title")
                    .text("Yearly Temperature Anomaly from 1991 - 2023")
                    .attr("font-size", "24px")
                    .attr("font-weight", "bold")
                    .attr("fill", "#111111");

    svg_temp_anomaly.append("text")
                    .attr("x", 1160)
                    .attr("y", 80)
                    .text("+ " + d3.max(dataset, d => d.anomaly).toFixed(3))
                    .attr("font-size", "28px")
                    .attr("font-weight", "bold")
                    .attr("fill", temp_anomaly_color_scale_plus(d3.max(dataset, d => d.anomaly)));

    // svg_temp_anomaly.append("text")
    //                 .attr("x", 100)
    //                 .attr("y", 770)
    //                 .text(d3.min(dataset, d => d.anomaly).toFixed(3))
    //                 .attr("font-size", "28px")
    //                 .attr("font-weight", "bold")
    //                 .attr("fill", temp_anomaly_color_scale_minus(d3.min(dataset, d => d.anomaly)));

    svg_temp_anomaly.append("text")
                    .attr("x", 100)
                    .attr("y", 450)
                    .attr("class", "axis-labels")
                    .text("Annual Temperature Annomaly (deg C)")
                    .attr("transform", "rotate(-90, 50, 460)");

    svg_temp_anomaly.append("text")
                    .attr("x", 620)
                    .attr("y", 480)
                    .attr("class", "axis-labels")
                    .text("Years");

    const tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);

    svg_temp_anomaly.selectAll("rect")
                    .data(dataset)
                    .join("rect")
                    .on("mouseover", (event, d) => {
                        d3.select("#tooltip")
                        .style("color", tooltip_text_color)
                        .transition()
                        .duration(300)
                        .style("opacity", 1)
                        .style("left", (event.pageX + 12) + "px")
                        .style("top", (event.pageY + 0) + "px")
                        tooltip.html("Year: " + d.year + "<br>" + "Anomaly (deg C): " + "<br>" + d.anomaly.toFixed(3)); //truncating the emission value to round of

                })
                .on("mouseout", (event, d) => {
                    d3.select("#tooltip")
                    .transition()
                    .style("opacity", 0);
                })
                .on("mousemove", (event, d) => {
                    d3.select("#tooltip")
                    .style("left", (event.pageX + 12) + "px")
                    .style("top", (event.pageY + 0) + "px")
                });

});

const darkModeProps = [["#svg1", "background-color", "#111111"], 
                        [".axis path", "stroke", "#eeeeee"],
                        [".axis line", "stroke", "#eeeeee"],
                        ["#bot.axis text", "color", "#eeeeee"],
                        ["#left.axis text", "color", "#eeeeee"],
                        ["#tooltip", "background", "#eeeeee"],
                        [".viz-title", "fill", "#eeeeee"],
                        [".axis-labels", "fill", "#eeeeee"]];

const lightModeProps = [["#svg1", "background-color", "#eeeeee"], 
                        [".axis path", "stroke", "#111111"],
                        [".axis line", "stroke", "#111111"],
                        ["#bot.axis text", "color", "#111111"],
                        ["#left.axis text", "color", "#111111"],
                        ["#tooltip", "background", "#111111"],
                        [".viz-title", "fill", "#111111"],
                        [".axis-labels", "fill", "#333333"]];

function setCss(querySelector, property, value) {

    $(querySelector).css(property, value);
    
}

function darkMode() {
    darkModeProps.forEach( element => {
        [query, prop, value] = element;
        setCss(query, prop, value);
        tooltip_text_color = "#111111";
    });
};

function lightMode() {
    lightModeProps.forEach( element => {
        [query, prop, value] = element;
        setCss(query, prop, value);
        tooltip_text_color = "#eeeeee";
    });
};

async function main() {
    $("#toggle-button").change(function() {

        $("#toggle-button").is(":checked") ? darkMode() : lightMode();

    });

}

main();