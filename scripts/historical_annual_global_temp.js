//Chart global variables
const margin = 100;
const width = 1500;
const height = 1000;

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
                    .attr("x", 500)
                    .attr("y", 60)
                    .text("Yearly Temperature Anomaly from 1991 - 2023")
                    .attr("font-size", "24px")
                    .attr("font-weight", "bold")
                    .attr("fill", "#eeeeee");

    svg_temp_anomaly.append("text")
                    .attr("x", 1340)
                    .attr("y", 100)
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

    const tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);

    svg_temp_anomaly.selectAll("rect")
                    .data(dataset)
                    .join("rect")
                    .on("mouseover", (event, d) => {
                        d3.select("#tooltip")
                        .transition()
                        .duration(300)
                        .style("opacity", 1)
                        .style("left", (event.pageX + 12) + "px")
                        .style("top", (event.pageY + 0) + "px")
                        tooltip.html("Anomaly (deg C): " + "<br>" + d.anomaly.toFixed(3)); //truncating the emission value to round of

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