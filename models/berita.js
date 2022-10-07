module.exports = (sequelize, Sequelize) => {
	const Berita = sequelize.define("berita", {
		judul: {
			type: Sequelize.STRING
		},
		deskripsi: {
			type: Sequelize.TEXT
		},
		isi: {
			type: Sequelize.TEXT
		},
		gambar: {
			type: Sequelize.STRING
		}			
	});
	return Berita;
};