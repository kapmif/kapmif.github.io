// src/sensors.rs
fn main() {
    let thermal_range = -50.0..350.0;  // 使用浮点数表示温度范围
    let ir_resolution = (640, 480);    // 使用元组表示分辨率
    let detection_range = DetectionSpec { 
        distance: 150.0, 
        target_type: "human-sized".to_string()
    };
    
    println!("Thermal range: {:?}C", thermal_range);
    println!("IR resolution: {}x{} @ 30Hz", ir_resolution.0, ir_resolution.1);
}

struct DetectionSpec {
    distance: f32,
    target_type: String
}
