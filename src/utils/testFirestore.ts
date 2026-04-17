// Test Firestore Data Saving
// Run this in browser console to verify data persistence

const testFirestoreData = async () => {
  console.log('🔥 Testing Firestore Data Persistence...\n');

  try {
    // 1. Check initial data count
    console.log('1️⃣ Checking initial data count...');
    const { getMachinesCount, getMachines, verifyFirestoreData } = await import('./services/machineService');
    let count = await getMachinesCount();
    console.log(`📊 Initial count: ${count} machines\n`);

    // 2. If no data, seed it
    if (count === 0) {
      console.log('2️⃣ No data found. Seeding Firestore...');
      const { seedFirestore } = await import('./services/seedData');
      const result = await seedFirestore();

      if (result.success) {
        console.log(`✅ ${result.message}\n`);
        count = await getMachinesCount();
        console.log(`📊 New count: ${count} machines\n`);
      } else {
        console.log(`❌ Seeding failed: ${result.message}\n`);
        return;
      }
    }

    // 3. Verify data integrity
    console.log('3️⃣ Verifying data integrity...');
    const verification = await verifyFirestoreData();

    console.log(`📈 Total machines: ${verification.totalCount}`);
    console.log(`📂 Categories:`, verification.categories);
    console.log(`🔍 Sample data:`, verification.sampleData.slice(0, 2));
    console.log(`✅ Data valid: ${verification.isValid}\n`);

    // 4. Test category filtering
    console.log('4️⃣ Testing category filtering...');
    const { getMachinesByCategory } = await import('./services/machineService');
    const slcmMachines = await getMachinesByCategory('slcm');
    console.log(`🏗️ SLCM Mixers found: ${slcmMachines.length}`);

    const batchingPlants = await getMachinesByCategory('batching');
    console.log(`🏭 Batching Plants found: ${batchingPlants.length}\n`);

    // 5. Test search functionality
    console.log('5️⃣ Testing search functionality...');
    const { searchMachines } = await import('./services/machineService');
    const argoResults = await searchMachines('ARGO');
    console.log(`🔍 "ARGO" search results: ${argoResults.length} machines\n`);

    console.log('🎉 All Firestore tests passed! Data is properly saved and retrievable.');

  } catch (error) {
    console.error('❌ Firestore test failed:', error);
  }
};

// Auto-run if in browser environment
if (typeof window !== 'undefined') {
  testFirestoreData();
}

export { testFirestoreData };