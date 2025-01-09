import pdfMake from "pdfmake/build/pdfmake";
import "../../../../vfs_fonts";
pdfMake.fonts = {
    Kanit: {
        normal: 'Kanit-Regular.ttf',
        bold: 'Kanit-Bold.ttf',
        italics: 'Kanit-Italic.ttf',
    },
}


const pdfHeaders = (data) => {
    return ([
        { text: 'ใบเสร็จรับเงิน', fontSize: 16, alignment: 'center', lineHeight: 2 },
        {
            // margin: [0, 0, 0, 100],
            stack: [
                { text: `bill Id : ${data.id}` },
                { text: `Customer name : ${data.customer_name}` },
                { text: `Customer address : ${data.customer_address}` },
                { text: `Customer phone : ${data.customer_phone}` },
            ]
        },
    ])
};

const pdfTable = (data) => {
    const { OrderDetail } = data;

    return ([
        {
            margin: [0, 20, 0, 5],
            layout: 'headerLineOnly', // optional 'noBorders', 'headerLineOnly', 'lightHorizontalLines'
            table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: ['*', 'auto', 'auto', 'auto'],

                body: [
                    // headers
                    ['รายการ', 'ราคา/หน่วย', 'จำนวน', 'รวมรวม'],
                    // contents
                    ...OrderDetail.map((e, i) => ([
                        { text: `${i + 1} ${e.Product.product_name}` },
                        { text: `${e.price.toLocaleString('th-TH')}`, alignment: 'right' },
                        { text: `${e.quantity}`, alignment: 'center' },
                        { text: `${e.total_orderDetail.toLocaleString('th-TH')}`, alignment: 'right' }
                    ]))
                ]
            }
        }, {
            text: `ยอดรวม    ${data.total_order.toLocaleString('th-TH')}  บาท`, alignment: 'right'
        }
    ]
    )
};

const pdfAddress = (data) => {
    return ([
        {
            text: 'กรุณาจัดส่ง',
            fontSize: 16,
            alignment: 'center',
            lineHeight: 2,
            pageBreak: 'before'
        },
        {
            columns: [
                { width: '25%', text: '',alignment:'right'},
                {
                    width: '50%',
                    stack: [
                        { text: `คุณ${data.customer_name}` },
                        { text: `${data.customer_address}` },
                        { text: `tel. ${data.customer_phone}` },
                    ]
                },
                { width: '25%', text: '' },
            ],
            // optional space between columns
            columnGap: 10,
        },
    ])
};

export const printPDF = (data) => {
    const pdfContent = {
        // header: 'simple text',

        footer: {
            alignment: 'center',
            stack: [
                // { text: '@Copy right'},
                // { text: 'Company name' }
                '@Copy right',
                'Company name'
            ]
        },
        content: [
            pdfHeaders(data),
            pdfTable(data),
            pdfAddress(data)
        ],
        defaultStyle: {
            font: 'Kanit',
            fontSize: 10
        }
    }
    pdfMake.createPdf(pdfContent).open();
};