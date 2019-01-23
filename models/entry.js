module.exports = (sequelize, DataTypes) => {

    const Entry = sequelize.define('Entry', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        categories: {
            type: DataTypes.JSON,
            allowNull: false
        },
        github_repository: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        authors: {
            type: DataTypes.JSON,
            allowNull: false
        },
        images: {
            type: DataTypes.JSON,
            allowNull: false
        },
        round: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        win: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        loose: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        score: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        seed: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: () => Math.random()
        }
    }, {
        indexes: [
            {
                fields: ['github_repository'],
                unique: true
            }
        ]
    });

    Entry.findNext = async function(login) {
        return Entry.findAll({
            where: {
                github_repository: { $notLike: `${login}/%`}
            },
            order: [
                ['round'],
                ['loose'],
                ['score'],
                ['seed']
            ]
        });
    };

    return Entry;
};