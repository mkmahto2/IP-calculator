document.getElementById('calculate-btn').addEventListener('click', function() {
  const ip = document.getElementById('ip').value;
  const cidr = parseInt(document.getElementById('cidr').value);

  // Basic validation
  if (!ip || isNaN(cidr)) {
    document.getElementById('output').innerHTML = 'Please enter a valid IP address and CIDR.';
    return;
  }

  if (isIPv4(ip)) {
    calculateIPv4(ip, cidr);
  } else if (isIPv6(ip)) {
    calculateIPv6(ip, cidr);
  } else {
    document.getElementById('output').innerHTML = 'Invalid IP address format.';
  }
});

// IPv4 Calculation
function calculateIPv4(ip, cidr) {
  console.log("Calculating IPv4 for: " + ip + "/" + cidr);
  
  const totalIPs = Math.pow(2, 32 - cidr);

  let usableIPs = 0;
  if (cidr < 31) {
    usableIPs = totalIPs - 2;
  } else if (cidr === 31) {
    usableIPs = 2;  // In a /31 subnet, there are 2 usable IPs (no broadcast)
  } else {
    usableIPs = 1;  // /32 has only one IP which is the host itself
  }

  // Calculate network address, broadcast address, and usable range
  const networkAddress = getNetworkAddress(ip, cidr);
  const broadcastAddress = getBroadcastAddress(networkAddress, cidr);

  let usableIPList = "";
  if (usableIPs > 0) {
    for (let i = 1; i <= usableIPs; i++) {
      const usableIP = incrementIP(networkAddress, i);
      usableIPList += `<li>${usableIP}</li>`;
    }
  }

  document.getElementById('output').innerHTML = `
    <h2>IPv4 Results:</h2> 
    <p>Total IPs: ${totalIPs}</p>
    <p>Usable IPs: ${usableIPs}</p>
    <p>Network Address: ${networkAddress}</p>
    <p>Broadcast Address: ${broadcastAddress}</p>
    <p>List of Usable IPs:</p>
    <ul>${usableIPList}</ul>
  `;
}

// IPv6 Calculation
function calculateIPv6(ip, cidr) {
  console.log("Calculating IPv6 for: " + ip + "/" + cidr);
  
  const totalIPs = Math.pow(2, 128 - cidr);
  const usableIPs = totalIPs;

  document.getElementById('output').innerHTML = `
    <h2>IPv6 Results:</h2> 
    <p>Total IPs: ${totalIPs.toLocaleString()}</p>
    <p>Usable IPs: ${usableIPs.toLocaleString()}</p>
    <p>For large IPv6 subnets, listing usable IPs may not be practical.</p>
  `;
}

// Calculate the network address for IPv4
function getNetworkAddress(ip, cidr) {
  const ipArray = ip.split('.').map(num => parseInt(num));
  const mask = -1 << (32 - cidr);
  const network = (ipToInt(ipArray) & mask) >>> 0;
  return intToIp(network);
}

// Calculate the broadcast address for IPv4
function getBroadcastAddress(networkAddress, cidr) {
  const network = ipToInt(networkAddress.split('.').map(num => parseInt(num)));
  const mask = ~(-1 << (32 - cidr));
  const broadcast = (network | mask) >>> 0;
  return intToIp(broadcast);
}

// Convert IP to integer
function ipToInt(ipArray) {
  return (ipArray[0] << 24) + (ipArray[1] << 16) + (ipArray[2] << 8) + ipArray[3];
}

// Convert integer back to IP
function intToIp(int) {
  return `${(int >>> 24) & 255}.${(int >>> 16) & 255}.${(int >>> 8) & 255}.${int & 255}`;
}

// Increment IP by a given number (for usable IP list)
function incrementIP(ip, increment) {
  let intIp = ipToInt(ip.split('.').map(num => parseInt(num)));
  intIp += increment;
  return intToIp(intIp);
}

// Simple IP validation functions
function isIPv4(ip) {
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
}

function isIPv6(ip) {
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)|(([0-9a-fA-F]{1,4}:){6}(:[0-9a-fA-F]{1,4}|(:[0-9a-fA-F]{1,4}){1,2}))|::)$/;
  return ipv6Regex.test(ip);
}
