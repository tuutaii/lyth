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
      'title': 'Stellium Kim Ngưu',
      'subtitle': 'NĂNG LƯỢNG HỘI TỤ',
      'icon': '⛰️',
      'content': 'Dòng chảy năng lượng hội tụ mạnh mẽ giúp em luôn vững chãi trước mọi biến động. Em trân trọng sự an yên, vẻ đẹp thực tế và luôn biết cách tạo dựng sự an toàn cho chính mình.'
    },
    {
      'title': 'T-Square Đỉnh Kim Tinh',
      'subtitle': 'THỬ THÁCH & CHUYỂN HÓA',
      'icon': '⚡',
      'content': 'Thử thách giúp em nhận ra giá trị tự thân sâu sắc. Chỉ khi em thực sự trân trọng và yêu thương chính mình, em mới tìm thấy sự cân bằng tuyệt vời trong mọi mối quan hệ.'
    },
    {
      'title': 'La Hầu Cự Giải',
      'subtitle': 'SỨ MỆNH LINH HỒN',
      'icon': '🌊',
      'content': 'Tạm biệt những tham vọng khô khan, hành trình này dẫn lối em trở về với miền cảm xúc dịu êm. Học cách nuôi dưỡng tâm hồn và trao đi yêu thương chính là đích đến của em.'
    },
    {
      'title': 'Chiron Nhân Mã',
      'subtitle': 'VẾT THƯƠNG CHỮA LÀNH',
      'icon': '✨',
      'content': 'Vết thương từ những niềm tin cũ sẽ được chữa lành khi em dám tin vào trí tuệ của chính mình. Em sinh ra để truyền cảm hứng và ánh sáng tự do cho những linh hồn quanh em.'
    },
    {
      'title': 'Bố Cục Bập Bênh (Seesaw)',
      'subtitle': 'SỰ CÂN BẰNG NỘI TÂM',
      'icon': '⚖️',
      'content': 'Dù đôi khi cảm thấy bị giằng xé giữa hai thái cực, nhưng chính sự mâu thuẫn ấy lại giúp em nhìn thấy mọi mặt của vấn đề. Hãy tìm về sự tĩnh lặng trong những điều nhỏ bé nhất.'
    },
    {
      'title': 'Ưu Thế Năng Lượng',
      'subtitle': 'BẢN SẮC & TRÍ TUỆ',
      'icon': '🔥',
      'content': 'Với Mặt Trời và Mặt Trăng hoạt động mạnh mẽ, em sinh ra để tỏa sáng theo cách của riêng mình. Đừng ngại ngần sống rực rỡ và lan tỏa nguồn năng lượng ấm áp này nhé.'
    }
  ];
}
