// Test the wall thickness conversion logic
const testWallThicknessConversion = () => {
  console.log("Testing Wall Thickness Conversion:");
  
  const testCases = [
    { wallThickness: "0.8", expectedWallCount: 2 },
    { wallThickness: "1.2", expectedWallCount: 3 },
    { wallThickness: "1.6", expectedWallCount: 4 }
  ];
  
  testCases.forEach(({ wallThickness, expectedWallCount }) => {
    const wallThicknessFloat = parseFloat(wallThickness);
    const wallCount = Math.round(wallThicknessFloat / 0.4);
    
    console.log(`${wallThickness}mm → ${wallCount} walls (expected: ${expectedWallCount})`);
    
    if (wallCount === expectedWallCount) {
      console.log("✅ PASS");
    } else {
      console.log("❌ FAIL");
    }
  });
};

testWallThicknessConversion();
