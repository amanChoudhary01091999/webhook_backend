const { PDFDocument } = require('pdf-lib');
const generatePDF = async (val) => {
    // Read the static HTML file


    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a new page to the PDF
    const page = pdfDoc.addPage();

    // Set the size of the PDF page
    page.setSize(612, 792);

    // Draw the HTML content on the PDF page
    page.drawHTML(val, {
        x: 50,
        y: 50,
        width: 512,
        height: 692
    });

    // Save the PDF to a buffer
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
};


const convertToBlob = async (val) => {
    const pdfBytes = await generatePDF(val);

    return new Blob([pdfBytes], { type: 'application/pdf' });
};

module.exports = {
    convertToBlob
}