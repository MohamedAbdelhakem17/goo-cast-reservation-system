// components/BookingReceiptPDF.jsx
import React from 'react';
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
} from '@react-pdf/renderer';
import usePriceFormat from '../../../hooks/usePriceFormat';
import useDateFormat from '../../../hooks/useDateFormat';

// Styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
        lineHeight: 1.6,
    },
    header: {
        borderBottom: '1 solid #ccc',
        marginBottom: 20,
        paddingBottom: 10,
    },
    logo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 14,
        marginBottom: 6,
        fontWeight: 'bold',
        color: '#222',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
        padding: 6,
        fontWeight: 'bold',
    },
    tableRow: {
        borderBottom: '1 solid #eee',
        padding: 6,
    },
    footer: {
        borderTop: '1 solid #ccc',
        marginTop: 10,
        paddingTop: 10,
        textAlign: 'center',
        color: '#999',
        fontSize: 10,
    },
});


const BookingReceiptPDF = ({ booking }) => {

    const priceFormat = usePriceFormat()
    const dateFormat = useDateFormat()
    return < Document >

        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>Studio {booking.studio.name} Booking Receipt</Text>
                <Text>Receipt #: {booking._id}</Text>
                <Text>Date: {dateFormat(booking.createdAt)}</Text>
            </View>

            {/* Client Info */}

            <View style={{ marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>Client Information</Text>
                <Text>Name: {booking.personalInfo.fullName}</Text>
                <Text>Email: {booking.personalInfo.email}</Text>
                <Text>Phone: {booking.personalInfo.phone}</Text>
                {booking.personalInfo.brand && <Text>Brand: {booking.personalInfo.brand}</Text>}
            </View>

            {/* Booking Details */}
            <View style={{ marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>Booking Details</Text>
                <Text>Studio: {booking.studio.name}</Text>
                <Text>Status: {booking.status}</Text>
                <Text>Time: {booking.startSlot}</Text>
                <Text>Duration: {booking.duration} hours</Text>
                <Text>Persons: {booking.persons}</Text>
            </View>

            {/* Package */}
            {booking.package && (
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.sectionTitle}>Package</Text>
                    <View style={[styles.row, styles.tableHeader]}>
                        <Text>Name</Text>
                        <Text>Price</Text>
                    </View>
                    <View style={[styles.row, styles.tableRow]}>
                        <Text>{booking?.package?.name}</Text>
                        <Text>{priceFormat(booking?.totalPackagePrice)} </Text>
                    </View>
                </View>
            )}

            {/* Add-ons */}
            {booking.addOns?.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.sectionTitle}>Add-ons</Text>
                    <View style={[styles.row, styles.tableHeader]}>
                        <Text style={{ textAlign: 'start', width: 200 }}>Name</Text>
                        <Text style={{ textAlign: 'start', width: 50 }}>Quantity</Text>
                        <Text >Price</Text>
                    </View>
                    {booking.addOns.map((addon, i) => (
                        <View key={i} style={[styles.row, styles.tableRow]}>
                            <Text style={{ textAlign: 'start', width: 200 }}>{addon.item.name}</Text>
                            <Text style={{ textAlign: 'start', width: 50 }}>{addon.quantity}</Text>
                            <Text >{priceFormat(addon.item.price)} </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Payment Summary */}
            <View style={{ marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>Payment Summary</Text>
                {booking.package && (
                    <View style={styles.row}>
                        <Text>Package Price:</Text>
                        <Text>{priceFormat(booking?.totalPackagePrice)} </Text>
                    </View>
                )}
                {booking.totalAddOnsPrice > 0 && (
                    <View style={styles.row}>
                        <Text>Add-ons Price:</Text>
                        <Text>{priceFormat(booking.totalAddOnsPrice)} </Text>
                    </View>
                )}
                <View style={[styles.row, { marginTop: 10 }]}>
                    <Text>Total:</Text>
                    <Text style={{ fontWeight: 'bold' }}>{priceFormat(booking.totalPrice)} </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Thank you for booking with us!</Text>
                <Text>Studio Booking System</Text>
            </View>
        </Page>
    </Document>
};

export default BookingReceiptPDF;
