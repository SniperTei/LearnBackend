// 餐厅价位字典数据
const restaurantPriceLevels = [
    {
      key: 'super_expensive',
      value: '爆贵',
      group: 'RESTAURANT_PRICE_LEVEL',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      key: 'expensive',
      value: '很贵',
      group: 'RESTAURANT_PRICE_LEVEL',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      key: 'moderate',
      value: '正常',
      group: 'RESTAURANT_PRICE_LEVEL',
      createdBy: 'admin',
      updatedBy: 'admin'
    },
    {
      key: 'cheap',
      value: '便宜',
      group: 'RESTAURANT_PRICE_LEVEL',
      createdBy: 'admin',
      updatedBy: 'admin'
    }
  ];
  
  // 插入数据
  async function insertDictionaries() {
    try {
      // 清除已存在的餐厅价位数据
      await Dictionary.deleteMany({ 
        group: 'RESTAURANT_PRICE_LEVEL' 
      });
  
      // 插入新数据
      await Dictionary.insertMany(restaurantPriceLevels);
  
      console.log('Restaurant price level dictionaries initialized successfully!');
      process.exit(0);
    } catch (error) {
      console.error('Error initializing dictionaries:', error);
      process.exit(1);
    }
  }
  
  // 运行初始化
  insertDictionaries();