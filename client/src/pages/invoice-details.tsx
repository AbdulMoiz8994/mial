import { DashboardLayout } from "@/components/dashboard-layout";
import { ChevronLeft, Printer, Download } from "lucide-react";
import { useLocation } from "wouter";
import { useRef } from "react";

export default function InvoiceDetails() {
  const [, setLocation] = useLocation();
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Mock invoice data - replace with actual data from API
  const invoice = {
    invoiceNumber: "#V2475692",
    issuedDate: "01-01-2023",
    dueDate: "07-August-2023",
    client: "Lorem Ipsum",
    company: "Ivonne Design Studio",
    items: [
      {
        name: "Lorem Ipsum",
        price: 560.0,
        quantity: 7.0,
        days: "DAYS",
        total: 560,
      },
      {
        name: "Lorem Ipsum",
        price: 860.0,
        quantity: 19.5,
        days: "DAYS",
        total: 860,
      },
      {
        name: "Lorem Ipsum",
        price: 4000,
        quantity: 19.5,
        days: "DAYS",
        total: 1160,
      },
    ],
    subtotal: 2580.0,
    vat: 250.0,
    total: 2830.0,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real implementation, this would trigger a PDF download
    // For now, we'll use the browser's print to PDF feature
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        {/* Main Card */}
        <div
          className="bg-white rounded-xl p-4 md:p-6"
          style={{
            border: "1px solid #DDDDDD",
          }}
        >
          {/* Back Button + Header */}
          <div
            className="mb-5 pb-5"
            style={{ borderBottom: "1px solid #E5E7EB" }}
          >
            <button
              onClick={() => setLocation("/settings/billings")}
              className="flex items-center gap-2 mb-4 transition-colors hover:opacity-70"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <ChevronLeft size={20} color="#6B7280" />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#6B7280",
                }}
              >
                Back to Billing
              </span>
            </button>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "24px",
                    fontWeight: 600,
                    color: "#202020",
                    marginBottom: "4px",
                  }}
                >
                  Invoice Details
                </h1>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#6B7280",
                  }}
                >
                  View and download your invoice
                </p>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#6B7280",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #DADADA",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F2F2F2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFFFF";
                  }}
                >
                  <Printer size={16} />
                  Print
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    backgroundColor: "#CEA64F",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#B8924A";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#CEA64F";
                  }}
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Invoice Content */}
          <div
            ref={invoiceRef}
            className="rounded-xl p-6 md:p-8"
            style={{
              backgroundColor: "#FAFAFA",
              border: "1px solid #E5E7EB",
            }}
          >
            {/* Invoice Header */}
            <div className="mb-6 pb-6" style={{ borderBottom: "1px solid #E5E7EB" }}>
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                {/* Company Info */}
                <div>
                  <h2
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#202020",
                      marginBottom: "8px",
                    }}
                  >
                    {invoice.company}
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#6B7280",
                      }}
                    >
                      Issued Date: {invoice.issuedDate}
                    </span>
                  </div>
                </div>

                {/* Invoice Number & Actions */}
                <div className="text-right">
                  <div className="flex items-center gap-3 justify-end mb-2">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#6B7280",
                      }}
                    >
                      Invoice Number:
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#202020",
                      }}
                    >
                      {invoice.invoiceNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#6B7280",
                      }}
                    >
                      03:00 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#6B7280",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Invoice:
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#202020",
                    }}
                  >
                    {invoice.dueDate}
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#202020",
                    }}
                  >
                    {invoice.invoiceNumber}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#6B7280",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Client:
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#202020",
                    }}
                  >
                    {invoice.client}
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items Table */}
            <div className="mb-8">
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#202020",
                  marginBottom: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                ITEMS
              </div>

              {/* Table */}
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  overflow: "hidden",
                }}
              >
                {/* Table Header */}
                <div
                  className="grid grid-cols-12 gap-4 px-6 py-4"
                  style={{
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  <div
                    className="col-span-5"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    ITEMS
                  </div>
                  <div
                    className="col-span-3 text-center"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    PRICE
                  </div>
                  <div
                    className="col-span-2 text-center"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    QTY. DAYS
                  </div>
                  <div
                    className="col-span-2 text-right"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    TOTAL PRICE
                  </div>
                </div>

                {/* Table Rows */}
                {invoice.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 px-6 py-4"
                    style={{
                      borderBottom: index < invoice.items.length - 1 ? "1px solid #F3F4F6" : "none",
                    }}
                  >
                    <div
                      className="col-span-5"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: 400,
                        color: "#202020",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      className="col-span-3 text-center"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: 500,
                        color: "#202020",
                      }}
                    >
                      ${item.price.toFixed(2)}
                    </div>
                    <div
                      className="col-span-2 text-center"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: 400,
                        color: "#202020",
                      }}
                    >
                      {item.quantity}
                    </div>
                    <div
                      className="col-span-2 text-right"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#202020",
                      }}
                    >
                      ${item.total}
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoice Summary - Below Table */}
              <div className="mt-8 pt-4 px-2 md:px-4" style={{ borderTop: "1px solid #E5E7EB" }}>
                <div className="flex items-end justify-between gap-16 md:gap-24">
                  {/* Subtotal */}
                  <div>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#9CA3AF",
                        marginBottom: "8px",
                      }}
                    >
                      Subtotal
                    </div>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#202020",
                      }}
                    >
                      ${invoice.subtotal.toFixed(2)}
                    </div>
                  </div>

                  {/* VAT */}
                  <div>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#9CA3AF",
                        marginBottom: "8px",
                      }}
                    >
                      VAT
                    </div>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "#202020",
                      }}
                    >
                      ${invoice.vat.toFixed(2)}
                    </div>
                  </div>

                  {/* Total */}
                  <div>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "#9CA3AF",
                        marginBottom: "8px",
                      }}
                    >
                      Total
                    </div>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#202020",
                      }}
                    >
                      ${invoice.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex md:hidden items-center gap-3 mt-4">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#6B7280",
                backgroundColor: "#FFFFFF",
                border: "1px solid #DADADA",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F2F2F2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
              }}
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#FFFFFF",
                backgroundColor: "#CEA64F",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#B8924A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#CEA64F";
              }}
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          ${invoiceRef.current ? `#invoice-content, #invoice-content *` : ''} {
            visibility: visible;
          }
          ${invoiceRef.current ? `#invoice-content` : ''} {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
