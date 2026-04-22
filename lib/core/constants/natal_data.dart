class NatalData {
  static const Map<String, dynamic> planets = {
    'sun': {
      'name': 'Mặt Trời',
      'sign': 'Kim Ngưu',
      'icon': '☀️',
      'short_desc': 'Kiên định, thực tế & kiên nhẫn',
      'detail': 'Đại diện cho cái tôi và cốt lõi tính cách. Em sở hữu một nền tảng vững chãi, luôn biết cách hiện thực hóa những giấc mơ một cách bền bỉ và chắc chắn nhất.'
    },
    'moon': {
      'name': 'Mặt Trăng',
      'sign': 'Sư Tử',
      'icon': '🌙',
      'short_desc': 'Hào phóng, kiêu hãnh & ấm áp',
      'detail': 'Đại diện cho thế giới cảm xúc. Trái tim em khao khát được công nhận, tỏa sáng và bao bọc những người thương yêu bằng sự ấm áp vô điều kiện.'
    },
    'mercury': {
      'name': 'Thủy Tinh',
      'sign': 'Kim Ngưu',
      'icon': '☿',
      'short_desc': 'Logic, cẩn trọng & điềm tĩnh',
      'detail': 'Đại diện cho tư duy và giao tiếp. Tư duy của em chậm rãi nhưng vô cùng chắc chắn, mỗi lời em nói ra đều mang theo sức nặng của sự thực tế và chân thành.'
    },
    'venus': {
      'name': 'Kim Tinh',
      'sign': 'Kim Ngưu',
      'icon': '♀',
      'short_desc': 'Chung thủy, yêu cái đẹp & vật chất',
      'detail': 'Đại diện cho tình yêu và giá trị. Trong tình yêu, em trân trọng sự chung thủy và luôn biết cách tìm thấy vẻ đẹp lấp lánh ngay trong những điều giản đơn nhất.'
    },
    'mars': {
      'name': 'Hỏa Tinh',
      'sign': 'Song Tử',
      'icon': '♂',
      'short_desc': 'Linh hoạt, đa nhiệm & trí tuệ',
      'detail': 'Đại diện cho hành động và năng lượng. Em hành động nhanh nhạy, thích những thử thách trí não và luôn biết cách dùng ngôn từ để khơi nguồn cảm hứng.'
    },
    'jupiter': {
      'name': 'Mộc Tinh',
      'sign': 'Kim Ngưu',
      'icon': '♃',
      'short_desc': 'Thịnh vượng & bền vững',
      'detail': 'Đại diện cho may mắn. Sự phát triển của em đến từ việc xây dựng những giá trị vững chắc và biết cách trân trọng những nguồn lực mà vũ trụ trao tặng.'
    },
    'saturn': {
      'name': 'Thổ Tinh',
      'sign': 'Kim Ngưu',
      'icon': '♄',
      'short_desc': 'Trách nhiệm & kiên trì',
      'detail': 'Đại diện cho thử thách. Em học được bài học về sự trưởng thành thông qua việc xây dựng kỷ luật bản thân và kiên nhẫn đối mặt với những giới hạn của chính mình.'
    },
    'uranus': {
      'name': 'Thiên Vương Tinh',
      'sign': 'Bảo Bình',
      'icon': '♅',
      'short_desc': 'Đột phá & độc lập',
      'detail': 'Đại diện cho sự đổi mới. Em mang trong mình khát khao tự do và một tinh thần độc lập, luôn sẵn sàng bứt phá khỏi những khuôn mẫu cũ kỹ.'
    },
    'neptune': {
      'name': 'Hải Vương Tinh',
      'sign': 'Bảo Bình',
      'icon': '♆',
      'short_desc': 'Lý tưởng & nhân đạo',
      'detail': 'Đại diện cho lý tưởng. Em sở hữu một trực giác sâu sắc và trái tim nhân hậu, luôn hướng về một thế giới tốt đẹp, công bằng và đầy tình thương.'
    },
    'pluto': {
      'name': 'Diêm Vương Tinh',
      'sign': 'Nhân Mã',
      'icon': '♇',
      'short_desc': 'Chuyển hóa & chân lý',
      'detail': 'Đại diện cho sự tái sinh. Em trải qua những bước chuyển hóa nội tâm mạnh mẽ để tìm kiếm ý nghĩa đích thực và niềm tin sâu sắc vào cuộc sống.'
    },
  };

  static const List<Map<String, dynamic>> soulJourney = [
    {
      'title': 'Bố Cục Bập Bênh (Seesaw)',
      'subtitle': 'SỰ CÂN BẰNG NỘI TÂM',
      'icon': '⚖️',
      'content': 'Dòng chảy cuộc sống đưa em qua lại giữa những thái cực đối lập, giúp em nhìn nhận mọi mặt của vấn đề với cái nhìn đa chiều và thấu cảm. Tìm về sự tĩnh lặng tại Xử Nữ chính là chìa khóa để em kiến tạo sự ổn định từ chính những điều nhỏ bé nhất.'
    },
    {
      'title': 'La Hầu Cự Giải',
      'subtitle': 'SỨ MỆNH LINH HỒN',
      'icon': '🌊',
      'content': 'Vũ trụ gọi mời em tạm biệt những tham vọng khô khan để trở về với miền cảm xúc dịu êm. Học cách vỗ về trái tim và trao đi yêu thương vô điều kiện chính là hành trình thiêng liêng dẫn lối em đến với hạnh phúc đích thực.'
    },
    {
      'title': 'Chiron Nghịch Hành',
      'subtitle': 'VẾT THƯƠNG CHỮA LÀNH',
      'icon': '✨',
      'content': 'Vết thương từ quá khứ không phải là gánh nặng, mà là món quà mang tên lòng trắc ẩn. Khi em dám đối diện và ôm lấy những vùng tối trong tâm hồn, em không chỉ chữa lành cho chính mình mà còn trở thành ngọn hải đăng cho những linh hồn lạc lối.'
    },
    {
      'title': 'Nghịch Hành Nội Tâm',
      'subtitle': 'KHO BÁU ẨN GIẤU',
      'icon': '🔄',
      'content': 'Với Hải Vương và Diêm Vương đang "ngủ yên" trong trạng thái nghịch hành, thế giới nội tâm của em là một kho báu đầy huyền bí. Sức mạnh thực sự của em nằm ở khả năng tự chuyển hóa và làm chủ quyền lực cá nhân một cách âm thầm nhưng mãnh liệt.'
    }
  ];

  static const Map<String, dynamic> retrogradePlanets = {
    'neptune': {
      'name': 'Hải Vương Tinh Nghịch Hành',
      'detail': 'Thế giới nội tâm sâu thẳm như đại dương nhưng đôi khi khó diễn đạt thành lời. Em thường dè dặt hơn trong việc bộc lộ lý tưởng vì sợ bị vỡ mộng, nhưng chính sự hoài nghi ấy lại bảo vệ những giấc mơ thuần khiết nhất của em.'
    },
    'pluto': {
      'name': 'Diêm Vương Tinh Nghịch Hành',
      'detail': 'Những bài học sâu sắc về quyền lực và sự tái sinh từ bên trong. Em có xu hướng che giấu sức mạnh thật sự của mình, chờ đợi khoảnh khắc chín muồi để trỗi dậy mạnh mẽ từ những tro tàn của tổn thương.'
    },
    'chiron': {
      'name': 'Chiron Nghịch Hành',
      'detail': 'Nỗi đau là người thầy kiên nhẫn nhất. Hành trình chữa lành của em không phải là xóa bỏ vết sẹo, mà là học cách trân trọng sự bất toàn và biến nó thành nguồn năng lượng bao dung to lớn.'
    },
  };

  static const Map<String, dynamic> elementBalance = {
    'Đất': {
      'status': 'Mạnh',
      'icon': '🌱',
      'detail': 'Em mang trong mình sự vững chãi của đất mẹ, luôn thực tế và kiên trì xây dựng những giá trị bền vững. Hãy cho phép mình thêm một chút linh hoạt để đón nhận những làn gió mới của sự thay đổi nhé.'
    },
    'Nước': {
      'status': 'Thiếu',
      'icon': '💧',
      'detail': 'Đôi khi lý trí quá mạnh mẽ khiến em vô tình ngăn cách mình với dòng chảy cảm xúc. Học cách mở lòng và chấp nhận sự mềm mại sẽ giúp em kết nối sâu sắc hơn với chính mình và thế giới quanh em.'
    },
  };

  static const Map<String, dynamic> modalityBalance = {
    'Tiên phong': {
      'status': 'Thiếu',
      'icon': '⚡',
      'detail': 'Thay vì vội vàng dẫn đầu, em chọn cách quan sát và phản ứng theo nhịp điệu của hoàn cảnh. Động lực thầm lặng giúp em đạt được thành tựu mà không cần phải ồn ào tranh đấu.'
    },
    'Kiên định': {
      'status': 'Mạnh',
      'icon': '🏗️',
      'detail': 'Lòng trung thành và sự kiên định là bản sắc của em. Một khi đã xác định mục tiêu, em sẽ theo đuổi đến cùng với sự tập trung cao độ, dù đôi lúc điều này khiến em hơi khó thích nghi với cái mới.'
    },
    'Linh hoạt': {
      'status': 'Thiếu',
      'icon': '🌬️',
      'detail': 'Em trân trọng sự nhất quán và sống thật với những giá trị cá nhân. Dù đôi khi bị xem là cứng nhắc, nhưng chính sự kiên định ấy lại là điểm tựa vững chắc nhất cho em giữa dòng đời biến động.'
    },
  };

  static const List<Map<String, dynamic>> strongFactors = [
    {
      'name': 'Mặt Trời',
      'score': 64,
      'rank': '★★★★★',
      'desc': 'Ánh hào quang tự nhiên giúp em luôn nổi bật và tỏa sáng theo cách riêng biệt nhất.'
    },
    {
      'name': 'Mặt Trăng',
      'score': 62,
      'rank': '★★★★★',
      'desc': 'Sự nhạy cảm tinh tế giúp em thấu hiểu nhịp điệu cảm xúc và lan tỏa sự ấm áp đến mọi người.'
    },
    {
      'name': 'Thủy Tinh',
      'score': 53,
      'rank': '★★★★★',
      'desc': 'Tư duy sắc sảo và trí tò mò vô tận giúp em luôn tìm thấy những kết nối thú vị trong cuộc sống.'
    },
    {
      'name': 'Mộc Tinh',
      'score': 66,
      'rank': '★★★★★',
      'desc': 'Niềm tin lạc quan và khao khát mở rộng thế giới quan là nguồn năng lượng may mắn vô hạn của em.'
    },
  ];

  static const List<Map<String, dynamic>> lifeIndices = [
    {
      'title': 'Mục Đích Cuộc Sống',
      'score': 66.97,
      'rank': '★★★',
      'meaning': 'Em đang đi đúng hướng, chỉ cần thêm một chút can đảm để bước ra khỏi vùng an toàn và đón nhận những sứ mệnh mới.'
    },
    {
      'title': 'Tiềm Năng Phát Triển',
      'score': 63.11,
      'rank': '★★★',
      'meaning': 'Cơ hội luôn hiện hữu quanh em. Sự kiên trì và kỷ luật sẽ là bệ phóng đưa em chạm đến những đỉnh cao mới.'
    },
    {
      'title': 'Cân Bằng Cảm Xúc',
      'score': 80.46,
      'rank': '★★★★★',
      'meaning': 'Một tâm hồn bình yên và khả năng làm chủ cảm xúc tuyệt vời giúp em luôn giữ được sự hài hòa trong cuộc sống.'
    },
    {
      'title': 'Bài Học Nghiệp Quả',
      'score': 38.56,
      'rank': '★',
      'meaning': 'Hãy can đảm đối diện với những nỗi sợ và rèn luyện tính kỷ luật để tìm thấy định hướng thực sự của linh hồn.'
    },
    {
      'title': 'May Mắn & Thịnh Vượng',
      'score': 88.94,
      'rank': '★★★★★',
      'meaning': 'Vũ trụ luôn ưu ái dành tặng em những cơ hội tuyệt vời nhờ tinh thần lạc quan và sức sống mãnh liệt.'
    },
  ];

  static const Map<String, dynamic> personalityProfile = {
    'mbti': 'ESTJ',
    'title': 'Người Giám Sát',
    'desc': 'Em là hiện thân của sự thực tế, có tổ chức và trách nhiệm. Khả năng thiết lập trật tự giúp em luôn làm chủ được mọi tình huống.',
    'strength': 'Lãnh đạo quyết đoán, quản lý hiệu quả và luôn tận tụy với mục tiêu đề ra.',
    'advice': 'Hãy thử mở lòng với những góc nhìn mới và lắng nghe tiếng nói của trái tim nhiều hơn.'
  };
}
