import React from 'react'
import { Calendar, Clock, Mic } from "lucide-react"
import { Link } from 'react-router-dom'
export default function BookNow() {
    return (
        <div className="bg-gradient-to-r from-main to-main/70 text-white rounded-xl p-12 my-12">
            <div className="max-w-[90%] mx-auto text-center">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to elevate your content?</h3>
                <p className="text-lg mb-8 text-white/90">
                    Book your recording session today and take advantage of our professional studio facilities
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 px-4 py-7 rounded-lg backdrop-blur-sm">
                        <Calendar className="h-8 w-8 mx-auto mb-2" />
                        <h4 className="font-medium mb-1">Flexible Scheduling</h4>
                        <p className="text-sm text-white/80">Book your preferred date and time</p>
                    </div>

                    <div className="bg-white/10 px-4 py-7 rounded-lg backdrop-blur-sm">
                        <Mic className="h-8 w-8 mx-auto mb-2" />
                        <h4 className="font-medium mb-1">Professional Equipment</h4>
                        <p className="text-sm text-white/80">High-quality audio and video gear</p>
                    </div>

                    <div className="bg-white/10 px-4 py-7 rounded-lg backdrop-blur-sm">
                        <Clock className="h-8 w-8 mx-auto mb-2" />
                        <h4 className="font-medium mb-1">Quick Turnaround</h4>
                        <p className="text-sm text-white/80">Get your content ready to publish fast</p>
                    </div>
                </div>

                <Link to={"/booking"} className="bg-white text-red-600 hover:bg-red-50 border-white rounded-full py-3 px-8 font-semibold cursor-pointer mt-8 inline-block">
                    Book Your Session Now
                </Link>
            </div>
        </div>
    )
}
