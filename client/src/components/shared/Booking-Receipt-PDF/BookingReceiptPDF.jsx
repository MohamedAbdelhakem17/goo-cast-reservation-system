// components/BookingReceiptPDF.jsx
import React from 'react';
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image
} from '@react-pdf/renderer';
import usePriceFormat from '../../../hooks/usePriceFormat';
import useDateFormat from '../../../hooks/useDateFormat';
import logo from './logo.png';
import useTimeConvert from '../../../hooks/useTimeConvert';

// Styles
const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 11,
        fontFamily: 'Helvetica',
        lineHeight: 1.6,
    },
    header: {
        borderBottom: '1 solid #ccc',
        marginBottom: 20,
        paddingBottom: 10,
        flexDirection: 'column',

    },
    logo: {
        width: 150,          
        objectFit: "contain",  
        marginBottom: 5,
        marginTop: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
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
    col: {
        flex: 1,
        marginRight: 20,
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
    const priceFormat = usePriceFormat();
    const dateFormat = useDateFormat();
    const timeConvert = useTimeConvert()

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    {/* Logo Image */}
                    <Image
                        style={styles.logo}
                        src={logo}
                    />
                    <View>
                        <Text style={styles.title}>Booking Receipt</Text>
                        <Text>Receipt #: {booking._id}</Text>
                        <Text>Date: {dateFormat(booking.createdAt)}</Text>
                    </View>
                </View>

                {/* Client Info & Booking Details جنب بعض */}
                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    {/* Client Info */}
                    <View style={styles.col}>
                        <Text style={styles.sectionTitle}>Client Information</Text>
                        <Text>Name: {booking.personalInfo.fullName}</Text>
                        <Text>Email: {booking.personalInfo.email}</Text>
                        <Text>Phone: {booking.personalInfo.phone}</Text>
                        {booking.personalInfo.brand && (
                            <Text>Brand: {booking.personalInfo.brand}</Text>
                        )}
                    </View>

                    {/* Booking Details */}
                    <View style={styles.col}>
                        <Text style={styles.sectionTitle}>Booking Details</Text>
                        <Text>Studio: {booking.studio.name}</Text>
                        <Text>Time: {timeConvert(booking.startSlot)} ({booking.duration}h) </Text>
                        <Text>Persons: {booking.persons}</Text>
                    </View>
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
                            <Text>{priceFormat(booking?.totalPackagePrice)}</Text>
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
                            <Text>Price</Text>
                        </View>
                        {booking.addOns.map((addon, i) => (
                            <View key={i} style={[styles.row, styles.tableRow]}>
                                <Text style={{ textAlign: 'start', width: 200 }}>{addon.item.name}</Text>
                                <Text style={{ textAlign: 'start', width: 50 }}>{addon.quantity}</Text>
                                <Text>{priceFormat(addon.item.price)}</Text>
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
                            <Text>{priceFormat(booking?.totalPackagePrice)}</Text>
                        </View>
                    )}
                    {booking.totalAddOnsPrice > 0 && (
                        <View style={styles.row}>
                            <Text>Add-ons Price:</Text>
                            <Text>{priceFormat(booking.totalAddOnsPrice)}</Text>
                        </View>
                    )}

                    {
                        booking.totalPriceAfterDiscount !== booking.totalPrice && <View style={[styles.row, { marginTop: 10 }]}>
                            <Text>discount:</Text>
                            <Text style={{ fontWeight: 'bold' }}>
                                {priceFormat(booking.totalPrice - booking.totalPriceAfterDiscount)}
                            </Text>
                        </View>
                    }
                    <View style={[styles.row, { marginTop: 10 }]}>
                        <Text>Total:</Text>
                        <Text style={{ fontWeight: 'bold' }}>
                            {priceFormat(booking.totalPriceAfterDiscount || booking.totalPrice)}
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Thank you for booking with us!</Text>
                    <Text>Studio Booking System</Text>
                </View>
            </Page>
        </Document>
    );
};

export default BookingReceiptPDF;
