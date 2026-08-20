const { DataTypes, Sequelize } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: true,
    })

    await queryInterface.addConstraint('blogs', {
      fields: ['year'],
      type: 'check',
      where: Sequelize.literal(
        `"year" >= 1991 AND "year" <= EXTRACT(YEAR FROM CURRENT_DATE)`
      ),
      name: "blogs_year_validation"
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('blogs', 'blogs_year_validation')
    await queryInterface.removeColumn('blogs', 'year')
  },
}