import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import mockData from '../data/MockData.json';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';



