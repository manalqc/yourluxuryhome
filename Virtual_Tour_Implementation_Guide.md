# Virtual Tour Implementation Guide - YourLuxuryHome

## Overview

This guide explains how to create and configure a complete apartment virtual tour using our Django admin interface and the underlying 360° panoramic system. Our virtual tour system uses equirectangular panoramic images (360° photos) to create immersive room experiences similar to Google Street View or Matterport.

## Understanding the Virtual Tour System

### Core Components

1. **VirtualTourRoom**: Individual rooms with 360° panoramic images
2. **VirtualTourHotspot**: Interactive points within rooms (info, navigation, features)
3. **RoomConnection**: Direct navigation paths between rooms

### Image Requirements

- **Format**: Equirectangular panoramic images (360° x 180°)
- **Aspect Ratio**: 2:1 (e.g., 4096x2048, 6000x3000)
- **Minimum Resolution**: 2048x1024 pixels
- **Maximum File Size**: 10MB
- **Supported Formats**: JPG, PNG

## Step-by-Step Room Tour Creation

### 1. Creating a Virtual Tour Room

Navigate to Django Admin → Apartments → Virtual tour rooms → Add virtual tour room

#### Basic Information
- **Apartment**: Select the apartment this room belongs to
- **Name**: Descriptive name (e.g., "Master Bedroom", "Living Room")
- **Room type**: Choose from predefined types (living_room, bedroom, kitchen, etc.)
- **Description**: Optional detailed description
- **Order**: Display sequence (0 = first, 1 = second, etc.)

#### 360° Panoramic Image
- Upload your equirectangular panoramic image
- The system validates image format and dimensions automatically
- Preview shows how the image will appear in the tour

### 2. Camera Settings Explained

#### Initial Yaw (Horizontal Viewing Angle)
- **Range**: 0° to 360°
- **Purpose**: Sets where the camera looks horizontally when users enter the room
- **Examples**:
  - `0°` = North (front of the room)
  - `90°` = East (right side)
  - `180°` = South (back of the room)
  - `270°` = West (left side)

**Best Practice**: Set yaw to showcase the room's main feature (bed in bedroom, sofa in living room, stove in kitchen)

#### Initial Pitch (Vertical Viewing Angle)
- **Range**: -90° to +90°
- **Purpose**: Sets where the camera looks vertically
- **Examples**:
  - `0°` = Horizon level (eye level)
  - `+30°` = Looking slightly up (ceiling features)
  - `-15°` = Looking slightly down (floor details)
  - `+90°` = Looking straight up (ceiling)
  - `-90°` = Looking straight down (floor)

**Best Practice**: Use 0° for most rooms, slight positive values (+10° to +20°) for rooms with interesting ceiling features

#### Is Starting Room
- **Purpose**: Defines the entry point for the virtual tour
- **Rule**: Only ONE room per apartment can be the starting room
- **Recommendation**: Choose the main entrance, foyer, or most impressive room

### 3. Virtual Tour Hotspots

Hotspots are interactive elements that appear as clickable icons in the 360° view.

#### Hotspot Types

1. **Navigation**: Links to other rooms
2. **Information**: Provides details about room features
3. **Feature Highlight**: Points out special amenities
4. **Amenity**: Highlights apartment amenities

#### Position Settings

##### Position X (0.0 to 1.0)
- **0.0**: Far left of the panoramic image
- **0.5**: Center horizontally
- **1.0**: Far right of the panoramic image

##### Position Y (0.0 to 1.0)
- **0.0**: Top of the panoramic image
- **0.5**: Center vertically (horizon level)
- **1.0**: Bottom of the panoramic image

#### Finding Hotspot Positions

1. Open your panoramic image in an image editor
2. Note the image dimensions (e.g., 4096x2048)
3. Find the pixel coordinates where you want the hotspot
4. Convert to normalized coordinates:
   - X position = pixel_x / image_width
   - Y position = pixel_y / image_height

**Example**: For a 4096x2048 image, a hotspot at pixel (2048, 1024) would be:
- Position X = 2048 / 4096 = 0.5
- Position Y = 1024 / 2048 = 0.5

#### Hotspot Configuration

- **Title**: Short descriptive name
- **Description**: Detailed information (optional)
- **Icon**: CSS icon class name for frontend display
- **Connected Room**: Only for navigation hotspots
- **Is Active**: Toggle hotspot visibility

### 4. Room Connections

Room connections create direct navigation paths between rooms with smooth transitions.

#### Connection Fields

##### To Room
- Destination room when user clicks the connection hotspot
- Must be in the same apartment

##### Direction Label
- User-friendly navigation text
- Examples: "To Kitchen", "Exit to Balcony", "Master Bedroom"

##### Hotspot Position (X, Y)
- Same coordinate system as hotspots (0.0 to 1.0)
- Position where the navigation arrow/icon appears in the source room

##### Transition Angles

###### Transition Yaw
- **Purpose**: Where the camera looks horizontally after transitioning to the new room
- **Range**: 0° to 360°
- **Best Practice**: Point toward the entrance or back toward the previous room

###### Transition Pitch
- **Purpose**: Where the camera looks vertically after transition
- **Range**: -90° to +90°
- **Best Practice**: Keep at 0° (horizon level) for natural transitions

### 5. Implementation Workflow

#### Step 1: Plan Your Tour
1. Take or obtain 360° panoramic photos of each room
2. Decide the tour flow (which rooms connect to which)
3. Identify key features to highlight with hotspots

#### Step 2: Create Rooms
1. Add each room with basic information
2. Upload panoramic images
3. Set appropriate camera angles
4. Designate one room as the starting room

#### Step 3: Add Navigation
1. Create room connections between adjacent rooms
2. Position connection hotspots logically (near doorways)
3. Set transition angles for smooth navigation

#### Step 4: Add Information Hotspots
1. Identify room features worth highlighting
2. Add informational hotspots with descriptions
3. Position hotspots precisely on features

#### Step 5: Test and Refine
1. Navigate through the complete tour
2. Adjust camera angles and hotspot positions
3. Verify all connections work correctly

## Technical Implementation Details

### Frontend Integration

The virtual tour renders using Three.js in a WebView:

```javascript
// Camera positioning uses our stored values
camera.position.set(0, 0, 0);
camera.rotation.set(
    THREE.MathUtils.degToRad(room.initial_pitch),
    THREE.MathUtils.degToRad(room.initial_yaw),
    0
);
```

### Hotspot Rendering

Hotspots are positioned using spherical coordinates:

```javascript
// Convert normalized position to 3D coordinates
const phi = (position_x * 2 - 1) * Math.PI;
const theta = position_y * Math.PI;
const x = -Math.sin(phi) * Math.cos(theta);
const y = Math.sin(theta);
const z = Math.cos(phi) * Math.cos(theta);
```

### API Endpoints

- `GET /api/v1/apartments/{id}/virtual-tour-rooms/` - List all rooms
- `GET /api/v1/virtual-tour-rooms/{id}/hotspots/` - Get room hotspots
- `GET /api/v1/virtual-tour-rooms/{id}/connections/` - Get room connections

## Best Practices

### Photography Tips
1. Use a 360° camera or smartphone with panoramic capability
2. Ensure even lighting throughout the room
3. Remove clutter and stage the room attractively
4. Take photos from the center of the room at standing height

### Navigation Design
1. Always provide a way back to previous rooms
2. Use intuitive connection positions (near doorways)
3. Limit hotspots per room (5-8 maximum for clarity)
4. Group related information hotspots together

### User Experience
1. Start tours from the most impressive room
2. Create logical flow through the apartment
3. Highlight unique features and amenities
4. Provide clear navigation cues

### Technical Optimization
1. Optimize image file sizes while maintaining quality
2. Use descriptive room and hotspot names
3. Test tours on different devices and screen sizes
4. Ensure smooth transitions between rooms

## Troubleshooting

### Common Issues

1. **Images appear distorted**: Check aspect ratio is exactly 2:1
2. **Hotspots in wrong positions**: Verify coordinate calculations
3. **Poor image quality**: Increase source image resolution
4. **Slow loading**: Optimize image file sizes
5. **Navigation doesn't work**: Check room connections are properly configured

### Admin Interface Tips

1. Use the image preview to verify panoramic images
2. Test camera angles before finalizing
3. Save frequently when configuring multiple hotspots
4. Use descriptive names for easy management

## Example Configuration

### Living Room Setup
```
Name: "Luxury Living Room"
Room Type: living_room
Initial Yaw: 180° (facing the main seating area)
Initial Pitch: 0° (horizon level)
Is Starting Room: ✓

Hotspots:
- Navigation to Kitchen (0.2, 0.5) → "To Kitchen"
- Feature: Premium Sofa (0.5, 0.6) → "Italian Leather Sectional"
- Information: City View (0.8, 0.3) → "Panoramic City Views"

Room Connections:
- To Kitchen: (0.2, 0.5) → Yaw: 90°, Pitch: 0°
- To Balcony: (0.9, 0.5) → Yaw: 270°, Pitch: 0°
```

This comprehensive system allows you to create immersive, professional-quality virtual apartment tours that engage potential renters and showcase your luxury properties effectively.