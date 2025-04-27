import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Import separately

const InvoicePage = ({ order }) => {
  // Sample order data (replace with your actual data)
  const sampleOrder = {
    id: "INV-2023-001",
    date: new Date(),
    customer_name: "John Doe",
    customer_phone: "+1 234 567 8901",
    customer_address: "123 Main St, City, Country",
    productList: [
      { productName: "Product A", quantity: 2, rate: 100, subtotal: 200 },
      { productName: "Product B", quantity: 1, rate: 150, subtotal: 150 },
      { productName: "Product C", quantity: 3, rate: 75, subtotal: 225 },
    ],
    sub_total: 575,
    gst: 86.25,
    discount: 50,
    total: 611.25,
    status: "Paid",
  };

  const currentOrder = order || sampleOrder;

  // Calculate totals if not provided
  if (!currentOrder.sub_total) {
    currentOrder.sub_total = currentOrder.productList.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
  }
  if (!currentOrder.total) {
    currentOrder.total =
      currentOrder.sub_total +
      (currentOrder.gst || 0) -
      (currentOrder.discount || 0);
  }

const downloadPDF = () => {
  const doc = new jsPDF();

  // Invoice header
  doc.setFontSize(20);
  doc.text("INVOICE", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Invoice #: ${currentOrder.id}`, 14, 30);
  doc.text(`Date: ${currentOrder.date.toLocaleDateString()}`, 14, 37);

  // Company info
  doc.setFontSize(14);
  doc.text("Your Company Name", 14, 50);
  doc.setFontSize(10);
  doc.text("123 Business St", 14, 57);
  doc.text("City, State, ZIP", 14, 64);
  doc.text("Phone: (123) 456-7890", 14, 71);

  // Customer info
  doc.setFontSize(12);
  doc.text("Bill To:", 105, 50);
  doc.setFontSize(10);
  doc.text(currentOrder.customer_name, 105, 57);
  doc.text(currentOrder.customer_phone, 105, 64);
  doc.text(currentOrder.customer_address, 105, 71);

  // Table
  autoTable(doc, {
    startY: 80,
    head: [["#", "Product", "Qty", "Rate", "Subtotal"]],
    body: currentOrder.productList.map((item, index) => [
      index + 1,
      item.productName,
      item.quantity,
      `$${item.rate.toFixed(2)}`,
      `$${item.subtotal.toFixed(2)}`,
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { cellWidth: 20 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
    },
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);

  doc.text("Subtotal:", 140, finalY);
  doc.text(`$${currentOrder.sub_total.toFixed(2)}`, 170, finalY);

  if (currentOrder.discount) {
    doc.text("Discount:", 140, finalY + 7);
    doc.text(`-$${currentOrder.discount.toFixed(2)}`, 170, finalY + 7);
  }

  if (currentOrder.gst) {
    doc.text("GST:", 140, finalY + 14);
    doc.text(`$${currentOrder.gst.toFixed(2)}`, 170, finalY + 14);
  }

  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Total:", 140, finalY + 21);
  doc.text(`$${currentOrder.total.toFixed(2)}`, 170, finalY + 21);

  // Footer
  doc.setFont(undefined, "normal");
  doc.setFontSize(8);
  doc.text("Thank you for your business!", 105, 280, { align: "center" });
  doc.text("Terms & Conditions: Payment due within 15 days", 105, 285, {
    align: "center",
  });

  doc.save(`invoice_${currentOrder.id}.pdf`);
};
  return (
    <div className="p-5 shadow-md">
      <div className="bg-white p-5 rounded">
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
            <p className="text-gray-600">#{currentOrder.id}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">
              Date: {currentOrder.date.toLocaleDateString()}
            </p>
            <p
              className={`px-2 py-1 rounded inline-block mt-2 ${
                currentOrder.status === "Paid"
                  ? "bg-green-200 text-green-800"
                  : currentOrder.status === "Pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {currentOrder.status}
            </p>
          </div>
        </div>

        {/* Company and Customer Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">From</h2>
            <p className="font-medium">Your Company Name</p>
            <p className="text-gray-600">123 Business St</p>
            <p className="text-gray-600">City, State, ZIP</p>
            <p className="text-gray-600">Phone: (123) 456-7890</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Bill To</h2>
            <p className="font-medium">{currentOrder.customer_name}</p>
            <p className="text-gray-600">{currentOrder.customer_phone}</p>
            <p className="text-gray-600">{currentOrder.customer_address}</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-right">Qty</th>
                <th className="py-3 px-4 text-right">Rate</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {currentOrder.productList.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{item.productName}</td>
                  <td className="py-3 px-4 text-right">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">
                    ${item.rate.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    ${item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="ml-auto w-64">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium">Subtotal:</span>
            <span>${currentOrder.sub_total.toFixed(2)}</span>
          </div>
          {currentOrder.discount > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Discount:</span>
              <span className="text-red-600">
                -${currentOrder.discount.toFixed(2)}
              </span>
            </div>
          )}
          {currentOrder.gst > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">GST:</span>
              <span>${currentOrder.gst.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-4 border-b-2 border-gray-300 font-bold text-lg">
            <span>Total:</span>
            <span>${currentOrder.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer and Actions */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Thank you for your business!
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Terms & Conditions: Payment due within 15 days
          </p>

          <div className="flex justify-end space-x-4">
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
            >
              Download PDF
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
