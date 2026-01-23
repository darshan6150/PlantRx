import { useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Phone, Globe, ExternalLink } from "lucide-react";
import type { Business } from "@shared/schema";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Lazy load the map components
const MapContainer = lazy(() => import("react-leaflet").then(module => ({ default: module.MapContainer })));
const TileLayer = lazy(() => import("react-leaflet").then(module => ({ default: module.TileLayer })));
const Marker = lazy(() => import("react-leaflet").then(module => ({ default: module.Marker })));
const Popup = lazy(() => import("react-leaflet").then(module => ({ default: module.Popup })));

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Default coordinates for UK center
const DEFAULT_CENTER: [number, number] = [54.3781, -3.4360];
const DEFAULT_ZOOM = 6;

// Business categories
const BUSINESS_CATEGORIES = [
  { value: "health-clinic", label: "Health Clinic" },
  { value: "wellness-center", label: "Wellness Center" },
  { value: "herbal-shop", label: "Herbal Shop" },
  { value: "nutritionist", label: "Nutritionist" },
  { value: "fitness-center", label: "Fitness Center" },
  { value: "spa", label: "Spa & Wellness" },
  { value: "pharmacy", label: "Natural Pharmacy" },
  { value: "therapist", label: "Alternative Therapist" },
];

// Expertise areas
const EXPERTISE_AREAS = [
  "Naturopathy",
  "Herbalism", 
  "Nutrition",
  "Acupuncture",
  "Homeopathy",
  "Massage Therapy",
  "Aromatherapy",
  "Yoga",
  "Ayurveda",
  "Traditional Chinese Medicine",
  "Chiropractic",
  "Mental Health",
];

interface BusinessMapProps {
  className?: string;
}

interface BusinessFilters {
  category?: string;
  expertise?: string;
  location?: string;
  verified?: boolean;
}

export function BusinessMap({ className = "" }: BusinessMapProps) {
  const [filters, setFilters] = useState<BusinessFilters>({});
  const [searchLocation, setSearchLocation] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

  // Fetch businesses with filters
  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ["/api/businesses", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.expertise) params.append("expertise", filters.expertise);
      if (filters.location) params.append("location", filters.location);
      if (filters.verified !== undefined) params.append("verified", filters.verified.toString());
      
      const response = await fetch(`/api/businesses?${params}`);
      if (!response.ok) throw new Error("Failed to fetch businesses");
      return await response.json() as Business[];
    },
  });

  // Simple geocoding function (you can replace with a real geocoding service)
  const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
    // This is a basic mock implementation
    // In a real app, you'd use a geocoding service like Google Maps or OpenStreetMap
    const locationMap: Record<string, [number, number]> = {
      "london": [51.5074, -0.1278],
      "manchester": [53.4808, -2.2426],
      "birmingham": [52.4862, -1.8904],
      "leeds": [53.8008, -1.5491],
      "glasgow": [55.8642, -4.2518],
      "liverpool": [53.4084, -2.9916],
      "edinburgh": [55.9533, -3.1883],
      "bristol": [51.4545, -2.5879],
      "cardiff": [51.4816, -3.1791],
      "belfast": [54.5973, -5.9301],
    };

    const normalizedLocation = location.toLowerCase().trim();
    return locationMap[normalizedLocation] || null;
  };

  const handleLocationSearch = async () => {
    if (!searchLocation.trim()) return;
    
    const coordinates = await geocodeLocation(searchLocation);
    if (coordinates) {
      setMapCenter(coordinates);
      setMapZoom(10);
      setFilters(prev => ({ ...prev, location: searchLocation }));
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchLocation("");
    setMapCenter(DEFAULT_CENTER);
    setMapZoom(DEFAULT_ZOOM);
  };

  // Create custom icon for verified businesses
  const createCustomIcon = (isVerified: boolean) => {
    const color = isVerified ? '#10b981' : '#6b7280';
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [25, 25],
      iconAnchor: [12, 12],
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Business Directory & Map
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover verified health and wellness professionals in your area. Filter by category, expertise, and location to find the perfect match for your needs.
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-sage-200 dark:border-sage-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-900 dark:text-white">Category</Label>
              <Select
                value={filters.category || "all"}
                onValueChange={(value) => setFilters(prev => ({ ...prev, category: value === "all" ? undefined : value }))}
              >
                <SelectTrigger className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="all" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">All Categories</SelectItem>
                  {BUSINESS_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expertise Filter */}
            <div className="space-y-2">
              <Label htmlFor="expertise" className="text-gray-900 dark:text-white">Expertise</Label>
              <Select
                value={filters.expertise || "all"}
                onValueChange={(value) => setFilters(prev => ({ ...prev, expertise: value === "all" ? undefined : value }))}
              >
                <SelectTrigger className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="All Expertise" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="all" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">All Expertise</SelectItem>
                  {EXPERTISE_AREAS.map((expertise) => (
                    <SelectItem key={expertise} value={expertise} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      {expertise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Search */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-900 dark:text-white">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter city name"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                  className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
                <Button onClick={handleLocationSearch} size="sm" className="text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
                  Search
                </Button>
              </div>
            </div>

            {/* Verified Filter */}
            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-white">Filter Options</Label>
              <div className="flex flex-col gap-2">
                <Button
                  variant={filters.verified === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    verified: prev.verified === true ? undefined : true 
                  }))}
                  className={filters.verified === true ? "text-white bg-blue-600 hover:bg-blue-700" : "text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"}
                >
                  Verified Only
                </Button>
                <Button variant="outline" size="sm" onClick={clearFilters} className="text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Clear All
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-gray-600 dark:text-gray-300">Active filters:</span>
              {filters.category && (
                <Badge variant="secondary">
                  Category: {BUSINESS_CATEGORIES.find(c => c.value === filters.category)?.label}
                </Badge>
              )}
              {filters.expertise && (
                <Badge variant="secondary">Expertise: {filters.expertise}</Badge>
              )}
              {filters.location && (
                <Badge variant="secondary">Location: {filters.location}</Badge>
              )}
              {filters.verified && (
                <Badge variant="secondary">Verified</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Map and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <Card className="h-[500px]">
          <CardContent className="p-0 h-full">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
              className="rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {businesses.map((business) => {
                // Use actual latitude/longitude from the business data
                const coordinates = [business.latitude, business.longitude] as [number, number];
                
                return (
                  <Marker
                    key={business.id}
                    position={coordinates}
                    icon={createCustomIcon(business.verificationStatus === "verified")}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-semibold text-lg text-gray-900">{business.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{business.description}</p>
                        
                        {business.averageRating && business.averageRating > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{business.averageRating}</span>
                            <span className="text-xs text-gray-500">
                              ({business.reviewCount} reviews)
                            </span>
                          </div>
                        )}
                        
                        {business.verificationStatus === "verified" && (
                          <Badge variant="secondary" className="mb-2">
                            Verified
                          </Badge>
                        )}
                        
                        <div className="text-xs space-y-1">
                          {business.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span className="text-gray-900">{business.phone}</span>
                            </div>
                          )}
                          {business.website && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <a 
                                href={business.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Visit Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </CardContent>
        </Card>

        {/* Business List */}
        <Card className="h-[500px] overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
              <span>Businesses Found ({businesses.length})</span>
              {isLoading && (
                <div className="text-sm text-gray-600 dark:text-gray-300">Loading...</div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full overflow-auto space-y-4">
            {businesses.length === 0 && !isLoading ? (
              <div className="text-center py-8 text-gray-600 dark:text-gray-300">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No businesses found matching your criteria.</p>
                <p className="text-sm">Try adjusting your filters or search location.</p>
              </div>
            ) : (
              businesses.map((business) => (
                <Card key={business.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{business.name}</h3>
                      {business.verificationStatus === "verified" && (
                        <Badge variant="secondary">Verified</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {business.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3 text-gray-700 dark:text-gray-300">
                      <div>
                        <span className="font-medium">Category:</span> {business.category}
                      </div>
                      {business.address && (
                        <div>
                          <span className="font-medium">Address:</span> {business.address}
                        </div>
                      )}
                    </div>
                    
                    {business.expertise && Array.isArray(business.expertise) && business.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(business.expertise as string[]).slice(0, 3).map((area: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                        {(business.expertise as string[]).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(business.expertise as string[]).length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      {business.averageRating && business.averageRating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-900 dark:text-white">{business.averageRating}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({business.reviewCount})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">No reviews yet</span>
                      )}
                      
                      <div className="flex gap-2">
                        {business.phone && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={`tel:${business.phone}`}>
                              <Phone className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                        {business.website && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={business.website} >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}