import {
    db,
    doc,
    setDoc,
    collection,
    getDocs,
    onSnapshot
} from "./firebase.js";


const svg = document.getElementById("map");
let isAdmin = false;
let selectedPlot = null;


/* ==========================
   COUNTERS
========================== */

function updateCounts() {

    let available = 0;
    let booked = 0;
    let sold = 0;

    plots.forEach(plot => {

        if (plot.status === "available") {
            available++;
        }

        else if (plot.status === "booked") {
            booked++;
        }

        else if (plot.status === "sold") {
            sold++;
        }

    });


    document.getElementById("availableCount").innerText =
        available;

    document.getElementById("bookedCount").innerText =
        booked;

    document.getElementById("soldCount").innerText =
        sold;

}


/* ==========================
   FIREBASE SAVE
========================== */

async function savePlots() {

    for (const plot of plots) {

        await setDoc(
            doc(
                db,
                "layout2Plots",
                String(plot.id)
            ),
            plot
        );

    }

}


/* ==========================
   FIREBASE LOAD
========================== */

async function loadPlots() {

    try {

        const snapshot = await getDocs(
            collection(
                db,
                "layout2Plots"
            )
        );


        snapshot.forEach(docSnap => {

            const savedPlot =
                docSnap.data();


            const plot =
                plots.find(
                    p => p.id === savedPlot.id
                );


            if (plot) {

                plot.status =
                    savedPlot.status ||
                    "available";


                plot.customer =
                    savedPlot.customer ||
                    "";


                plot.extent =
                    savedPlot.extent ||
                    "";


                plot.facing =
                    savedPlot.facing ||
                    "";

            }

        });


        drawPlots();

    }

    catch (error) {

        console.error(
            "Firebase Load Error:",
            error
        );

        drawPlots();

    }

}


/* ==========================
   REALTIME UPDATES
========================== */

function startRealtimeUpdates() {

    onSnapshot(

        collection(
            db,
            "layout2Plots"
        ),

        snapshot => {

            snapshot.forEach(docSnap => {

                const savedPlot =
                    docSnap.data();


                const plot =
                    plots.find(
                        p => p.id === savedPlot.id
                    );


                if (plot) {

                    plot.status =
                        savedPlot.status ||
                        "available";


                    plot.customer =
                        savedPlot.customer ||
                        "";


                    plot.extent =
                        savedPlot.extent ||
                        "";


                    plot.facing =
                        savedPlot.facing ||
                        "";

                }

            });


            drawPlots();

        },

        error => {

            console.error(
                "Realtime Firebase Error:",
                error
            );

        }

    );

}


/* ==========================
   POPUP
========================== */

function showPlotPopup(plot) {

    selectedPlot = plot;


    document.getElementById(
        "popupPlotNo"
    ).innerText = plot.id;


    document.getElementById(
        "popupStatus"
    ).innerText = plot.status;


    document.getElementById(
        "popupCustomer"
    ).innerText =
        plot.customer || "";


    document.getElementById(
        "popupExtent"
    ).innerText =
        plot.extent || "";


    document.getElementById(
        "popupFacing"
    ).innerText =
        plot.facing || "";


    const customerInput =
        document.getElementById(
            "customerInput"
        );


    if (customerInput) {

        customerInput.value =
            plot.customer || "";

    }


    const adminSection =
        document.getElementById(
            "adminSection"
        );


    if (isAdmin) {

        adminSection.style.display =
            "block";

    }

    else {

        adminSection.style.display =
            "none";

    }


    document.getElementById(
        "plotPopup"
    ).style.display =
        "block";

}


/* ==========================
   CLOSE POPUP
========================== */

function closePopup() {

    document.getElementById(
        "plotPopup"
    ).style.display =
        "none";

}


/* ==========================
   SAVE CUSTOMER
========================== */

async function saveCustomer() {

    if (!selectedPlot) {
        return;
    }


    const customerInput =
        document.getElementById(
            "customerInput"
        );


    const customerName =
        customerInput.value.trim();


    selectedPlot.customer =
        customerName;


    try {

        await savePlots();


        document.getElementById(
            "popupCustomer"
        ).innerText =
            customerName;


        alert(
            "Customer Saved"
        );

    }

    catch (error) {

        console.error(
            "Save Customer Error:",
            error
        );


        alert(
            "Unable to save customer"
        );

    }

}


/* ==========================
   CHANGE STATUS
========================== */

async function setStatus(status) {

    if (!selectedPlot) {
        return;
    }


    selectedPlot.status =
        status;


    try {

        await savePlots();


        document.getElementById(
            "popupStatus"
        ).innerText =
            status;


        drawPlots();

    }

    catch (error) {

        console.error(
            "Status Save Error:",
            error
        );


        alert(
            "Unable to save status"
        );

    }

}


/* ==========================
   DRAW PLOTS
========================== */

function drawPlots() {

    svg.innerHTML = "";


    plots.forEach(plot => {


        /* ======================
           POLYGON PLOT
        ====================== */

        if (plot.type === "polygon") {


            const polygon =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "polygon"
                );


            polygon.setAttribute(
                "points",
                plot.points
            );


            /* COLOR */

            let color =
                "green";


            if (plot.status === "booked") {

                color =
                    "yellow";

            }


            if (plot.status === "sold") {

                color =
                    "red";

            }


            polygon.setAttribute(
                "fill",
                color
            );


            polygon.setAttribute(
                "stroke",
                "black"
            );


            polygon.setAttribute(
                "fill-opacity",
                "0.7"
            );


            polygon.setAttribute(
                "stroke-width",
                "3"
            );


            polygon.style.cursor =
                "pointer";


            /* CLICK */

            polygon.addEventListener(
                "click",
                () => {

                    showPlotPopup(
                        plot
                    );

                }
            );


            svg.appendChild(
                polygon
            );


            /* ======================
               PLOT NUMBER
            ====================== */

            const text =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );


            text.setAttribute(
                "x",
                plot.textX
            );


            text.setAttribute(
                "y",
                plot.textY
            );


            text.setAttribute(
                "text-anchor",
                "middle"
            );


            text.setAttribute(
                "dominant-baseline",
                "middle"
            );


            text.setAttribute(
                "fill",
                "white"
            );


            text.setAttribute(
                "font-size",
                "18"
            );


            text.setAttribute(
                "font-weight",
                "bold"
            );


            text.textContent =
                plot.id;


            /* IMPORTANT:
               Prevent number from
               blocking plot click */

            text.style.pointerEvents =
                "none";


            svg.appendChild(
                text
            );

        }

    });


    updateCounts();

}


/* ==========================
   INITIAL LOAD
========================== */

loadPlots();

startRealtimeUpdates();


/* ==========================
   SVG COORDINATES
========================== */

svg.addEventListener(
    "mousemove",
    (e) => {


        const point =
            svg.createSVGPoint();


        point.x =
            e.clientX;


        point.y =
            e.clientY;


        const matrix =
            svg.getScreenCTM();


        if (!matrix) {
            return;
        }


        const svgPoint =
            point.matrixTransform(
                matrix.inverse()
            );


        document.getElementById(
            "coordinates"
        ).innerText =
            `X: ${Math.round(svgPoint.x)} | Y: ${Math.round(svgPoint.y)}`;

    }
);



/* ==========================
   SEARCH PLOT
========================== */

document
    .getElementById(
        "searchBtn"
    )
    .addEventListener(
        "click",
        () => {


            const plotNo =
                parseInt(
                    document.getElementById(
                        "searchPlot"
                    ).value
                );


            const plot =
                plots.find(
                    p => p.id === plotNo
                );


            if (plot) {

                showPlotPopup(
                    plot
                );

            }

            else {

                alert(
                    "Plot Not Found"
                );

            }

        }
    );


/* ==========================
   ADMIN LOGIN
========================== */

document
    .getElementById(
        "adminBtn"
    )
    .addEventListener(
        "click",
        () => {


            const password =
                prompt(
                    "Enter Admin Password"
                );


            if (
                password === "7702"
            ) {

                isAdmin =
                    true;


                alert(
                    "Admin Mode Enabled"
                );

            }

            else {

                alert(
                    "Wrong Password"
                );

            }

        }
    );


/* ==========================
   OUTSIDE CLICK CLOSE
========================== */

window.addEventListener(
    "click",
    event => {


        const popup =
            document.getElementById(
                "plotPopup"
            );


        if (
            event.target === popup
        ) {

            popup.style.display =
                "none";

        }

    }
);


/* ==========================
   GLOBAL FUNCTIONS
========================== */

window.closePopup =
    closePopup;


window.saveCustomer =
    saveCustomer;


window.setStatus =
    setStatus;