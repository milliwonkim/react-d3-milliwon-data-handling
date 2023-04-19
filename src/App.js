import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const data = [...new Array(1000000)].map((el, i) => {
  return {
    value: (i + 1) * Math.random(),
    count: i + 1,
  };
});

console.log("data", data);

// console.log("data", data);

const App = () => {
  const minValue = 1;
  const maxValue = 1000;
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Filter the data to the specified range
    const filteredData = data.filter(
      (d) => d.value >= minValue && d.value <= maxValue
    );

    /**
     * The reason why the code is not causing a freezing browser is
     * that the useEffect hook is only called once on initial render
     * and whenever minValue or maxValue change.
     *
     * The heavy computation of filtering the large dataset is done before the rendering happens,
     * and then the chart is rendered using the filtered data.
     *
     * The onmouseover and onmouseout event listeners attached to the bars are not heavy computations
     * and they don't cause a freezing browser
     * because they are only triggered when the user interacts with the chart.
     */
    // Set up the d3 scales and axes
    const xScale = d3
      .scaleLinear()
      .domain([minValue, maxValue])
      .range([0, 1000]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.count)])
      .range([300, 0]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Select the SVG element and set up the chart
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("width", 1500).attr("height", 300);

    // Add the x-axis and y-axis
    svg.append("g").attr("transform", "translate(0, 300)").call(xAxis);
    svg.append("g").call(yAxis);

    // Add the bars to the chart
    const bars = svg
      .selectAll("rect")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.value))
      .attr("y", (d) => yScale(d.count))
      .attr("width", 10)
      .attr("height", (d) => 300 - yScale(d.count))
      .attr("fill", "steelblue");

    // Add tooltips on hover
    bars
      .on("mouseover", function (event, d) {
        const tooltip = d3.select("#tooltip");

        tooltip
          .style("opacity", 1)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`)
          .html(`Value: ${d.value}<br>Count: ${d.count}`);
      })
      .on("mouseout", function (event, d) {
        const tooltip = d3.select("#tooltip");

        tooltip.style("opacity", 0);
      });
  }, [minValue, maxValue]);

  return (
    <>
      <svg style={{ padding: "16px" }} ref={svgRef}></svg>
      <div
        id="tooltip"
        style={{
          position: "absolute",
          opacity: 0,
          background: "#ffffff",
          padding: "16px",
          borderRadius: "8px",
        }}
      ></div>
    </>
  );
};

export default App;
