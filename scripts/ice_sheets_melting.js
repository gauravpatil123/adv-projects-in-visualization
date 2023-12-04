//Chart global variables
const margin = 100;
const width = 1000;
const height = 500;
var tooltip_text_color = "#eeeeee";

//loading data
d3.csv("../data/ice sheets/years ice sheets gt + mm.csv").then(dataset => {
    dataset.forEach(d => {
        d.year = +d["Year"];
        d.mass_gt = +d["Cumulative mass balance (Gt)"];
        d.mass_mm = +d["Cumulative mass balance (mm)"];
        d.mass_microm = +d["Cumulative mass balance (mm)"] * 1000;
    });

    const xScale = d3.scaleBand()
                    .domain(dataset.map(d => d.year))
                    .range([margin, width - margin])
                    .paddingInner(0.2)
                    .paddingOuter(0.2);

    const bottomAxis = d3.axisBottom().scale(xScale);

    const maxY_mass_gt = d3.max(dataset, d => d.mass_gt);
    const minY_mass_gt = d3.min(dataset, d => d.mass_gt);
    const maxY_mass_mm = d3.max(dataset, d => d.mass_mm);
    const minY_mass_mm = d3.min(dataset, d => d.mass_mm);
    const maxY_mass_microm = d3.max(dataset, d => d.mass_microm);
    const minY_mass_microm = d3.min(dataset, d => d.mass_microm);

    const maxY_left = 8000;
    const minY_left = -8000;
    
    const yScale_mass_left = d3.scaleLinear()
                                .domain([minY_left, maxY_left])
                                .range([height - margin, margin]);

    const yScale_mass_plus_gt = d3.scaleLinear()
                                .domain([0, maxY_left])
                                .range([(height / 2), margin]);

    const yScale_mass_minus_gt = d3.scaleLinear()
                                .domain([minY_left, 0])
                                .range([height - margin, (height / 2)]);

    const leftAxis_mass = d3.axisLeft().scale(yScale_mass_left);

    const mass_color_gt = d3.scaleLinear()
                            .domain([minY_mass_gt, maxY_mass_gt])
                            .range(["#AED6F1", "#1B4F72"]);
                                            
    // const mass_color_scale_plus_gt = d3.scaleLinear()
    //                                     .domain([0, maxY_mass_gt])
    //                                     .range(["#F1C40F", "#FD0000"]);
                            
    // const mass_color_scale_minus_gt = d3.scaleLinear()
    //                                     .domain([minY_mass_gt, 0])
    //                                     .range(["#1B4F72", "#AED6F1"]);

    const maxY_right = 20000;
    const minY_right = -20000;

    const yScale_mass_right = d3.scaleLinear()
                                .domain([minY_right, maxY_right])
                                .range([height - margin, margin]);

    const yScale_mass_plus_microm = d3.scaleLinear()
                                    .domain([0, maxY_right])
                                    .range([(height / 2), margin]);

    const yScale_mass_minus_microm = d3.scaleLinear()
                                    .domain([minY_right, 0])
                                    .range([height - margin, (height / 2)]);

    const rightAxis_mass = d3.axisRight().scale(yScale_mass_right);

    const mass_color_microm = d3.scaleLinear()
                                .domain([minY_mass_microm, maxY_mass_microm])
                                .range(["#F1C40F", "#FD0000"]);

    // const mass_color_scale_plus_microm = d3.scaleLinear()
    //                                         .domain([0, maxY_mass_microm])
    //                                         .range(["#F1C40F", "#FD0000"]);

    // const mass_color_scale_minus_microm = d3.scaleLinear()
    //                                         .domain([minY_mass_microm, 0])
    //                                         .range(["#1B4F72", "#AED6F1"]);

    const svg_mass = d3.select("#svg1");

    function chart_mass_gt() {

        svg_mass.selectAll("rect")
                .data(dataset)
                .join("rect")
                .transition()
                .ease(d3.easeLinear)
                .attr("x", d => xScale(d.year))
                .attr("y", d => d.mass_gt >= 0 ? yScale_mass_plus_gt(d.mass_gt) : height / 2)
                .attr("width", xScale.bandwidth())
                .attr("height", d => d.mass_gt >= 0 ? ((height / 2) - yScale_mass_plus_gt(d.mass_gt)) : (yScale_mass_minus_gt(d.mass_gt) - (height / 2)))
                .attr("fill", d => mass_color_gt(d.mass_gt));

        svg_mass.append("g")
                .attr("class", "axis")
                .attr("id", "bot")
                .attr("transform", "translate(0," + (height - margin) + ")")
                .call(bottomAxis);

        svg_mass.append("g")
                .attr("class", "axis")
                .attr("id", "left")
                .attr("transform", "translate(" + margin + ",0)")
                .call(leftAxis_mass);

        svg_mass.append("text")
                .attr("x", 230)
                .attr("y", 60)
                .attr("class", "viz-title")
                .text("MELTED ICE SHEET CUMULATIVE MASS (GT)");

        svg_mass.append("text")
                .attr("x", 100)
                .attr("y", 450)
                .attr("class", "axis-labels")
                .text("CUMULATIVE MASS BALANCE (GT)")
                .attr("transform", "rotate(-90, 50, 460)")

        svg_mass.append("text")
                .attr("x", 480)
                .attr("y", 460)
                .attr("class", "axis-labels")
                .text("YEARS")

        svg_mass.selectAll("rect")
                .data(dataset)
                .join("rect")
                .on("mouseover", (event, d) => {
                    d3.select("#tooltip")
                    .style("color", "#eeeeee")
                    .transition()
                    .duration(300)
                    .style("opacity", 1)
                    .style("left", (event.pageX + 12) + "px")
                    .style("top", (event.pageY + 0) + "px")
                    tooltip.html("YEAR: " + d.year + "<br>" + "CUMULATIVE MASS BALANCE (GT):" + "<br>" + d.mass_gt);
    
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

    }

    function chart_mass_mm() {

        svg_mass.selectAll("rect")
                .data(dataset)
                .join("rect")
                .transition()
                .ease(d3.easeLinear)
                .attr("x", d => xScale(d.year))
                .attr("y", d => d.mass_microm >= 0 ? yScale_mass_plus_microm(d.mass_microm) : height / 2)
                .attr("width", xScale.bandwidth())
                .attr("height", d => d.mass_microm >= 0 ? ((height / 2) - yScale_mass_plus_microm(d.mass_microm)) : (yScale_mass_minus_microm(d.mass_microm) - (height / 2)))
                .attr("fill", d => mass_color_microm(d.mass_microm));

        svg_mass.append("g")
                .attr("class", "axis")
                .attr("id", "bot")
                .attr("transform", "translate(0," + (height - margin) + ")")
                .call(bottomAxis);

        svg_mass.append("g")
                .attr("class", "axis")
                .attr("id", "right")
                .attr("transform", "translate(" + (width - margin)+ ",0)")
                .call(rightAxis_mass);

        svg_mass.append("text")
                .attr("x", 120)
                .attr("y", 60)
                .attr("class", "viz-title")
                .text("MELTED ICE SHEET CUMULATIVE MASS (SEA LEVEL 10e-3 mm)");

        svg_mass.append("text")
                .attr("x", -420)
                .attr("y", -490)
                .attr("class", "axis-labels")
                .text("CUMULATIVE MASS BALANCE (MICRO METERS)")
                .attr("transform", "rotate(90, 10, 460)")

        svg_mass.append("text")
                .attr("x", 480)
                .attr("y", 460)
                .attr("class", "axis-labels")
                .text("YEARS")

        svg_mass.selectAll("rect")
                .data(dataset)
                .join("rect")
                .on("mouseover", (event, d) => {
                    d3.select("#tooltip")
                    .style("color", "#eeeeee")
                    .transition()
                    .duration(300)
                    .style("opacity", 1)
                    .style("left", (event.pageX + 12) + "px")
                    .style("top", (event.pageY + 0) + "px")
                    tooltip.html("YEAR: " + d.year + "<br>" + "CUMULATIVE MASS BALANCE (mm):" + "<br>" + d.mass_mm);

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

    }

    const tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);

    function charts() {

        chart_mass_gt();

        d3.select("#mass-gt")
            .on("click", (event, d) => {

                svg_mass.selectAll("g")
                        .remove();

                svg_mass.selectAll("text")
                        .remove();

                chart_mass_gt();

            });

        d3.select("#mass-mm")
            .on("click", (event, d) => {

                svg_mass.selectAll("g")
                        .remove();

                svg_mass.selectAll("text")
                        .remove();

                chart_mass_mm();

            });

    }

     charts();

});

function button_active() {
        $(".button").on("click", function() {
                $(".bs").removeClass("button-active");
                $(this).addClass("button-active");
        });
}

function main() {
        button_active();
}

main();